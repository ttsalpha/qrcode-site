import { type NextRequest, NextResponse } from "next/server";
import { parseQRParams, type QRFormat } from "@/lib/qr-params";
// Pre-bundled server build of @ttsalpha/qrcode (which ships "use client" and so
// can't be imported directly on the server). See scripts/gen-qr-server.mjs.
import { toSVGString } from "@/lib/qrcode-server.generated.cjs";
import { fetchRemoteImage } from "@/lib/safe-fetch";

// Public QR image endpoint: SVG via toSVGString, PNG/JPG via sharp. Node only.
// sharp is imported lazily in the raster branch — a top-level native import
// crashes the whole route (incl. svg) when the platform binary is missing.

export async function GET(req: NextRequest) {
  const parsed = parseQRParams(req.nextUrl.searchParams);
  if (!parsed.ok) {
    return new NextResponse(parsed.message, { status: parsed.status });
  }
  const { props, format } = parsed;

  // A failed logo fetch drops the logo, not the whole QR (see resolveLogo).
  let logoDropped = false;
  if (props.logo?.src) {
    const resolved = await resolveLogo(props.logo.src);
    if (resolved) {
      props.logo = { ...props.logo, src: resolved };
    } else {
      logoDropped = true;
      props.logo = undefined;
    }
  }

  let svg: string;
  try {
    svg = toSVGString(props);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "could not encode QR";
    return new NextResponse(msg, { status: 422 });
  }

  if (format === "svg") {
    return new NextResponse(svg, {
      headers: imageHeaders("image/svg+xml; charset=utf-8", "svg", logoDropped),
    });
  }

  try {
    const { default: sharp } = await import("sharp");
    const pipeline = sharp(Buffer.from(svg));
    const buf =
      format === "jpg"
        ? await pipeline
            .flatten({ background: "#ffffff" })
            .jpeg({ quality: 90 })
            .toBuffer()
        : await pipeline.png().toBuffer();
    const contentType = format === "jpg" ? "image/jpeg" : "image/png";
    return new NextResponse(new Uint8Array(buf), {
      headers: imageHeaders(contentType, format, logoDropped),
    });
  } catch {
    return new NextResponse("could not rasterize QR", { status: 500 });
  }
}

function imageHeaders(
  contentType: string,
  ext: QRFormat,
  logoDropped: boolean,
): HeadersInit {
  return {
    "Content-Type": contentType,
    // Deterministic per URL → cache hard. But if a requested logo failed to
    // fetch, don't bake that transient miss into the CDN for a year.
    "Cache-Control": logoDropped
      ? "public, max-age=60"
      : "public, max-age=86400, s-maxage=31536000, immutable",
    "Access-Control-Allow-Origin": "*",
    "X-Content-Type-Options": "nosniff",
    "Content-Disposition": `inline; filename="qrcode.${ext}"`,
  };
}

// Remote logo → data: URI (sharp/librsvg won't fetch remote hrefs), or null to
// drop it. Fetch guarded by fetchRemoteImage.
async function resolveLogo(src: string): Promise<string | null> {
  if (src.startsWith("data:")) {
    return src.startsWith("data:image/") ? src : null;
  }
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return null;
  }
  const image = await fetchRemoteImage(url);
  if (!image) return null;
  const base64 = Buffer.from(image.buffer).toString("base64");
  return `data:${image.contentType};base64,${base64}`;
}
