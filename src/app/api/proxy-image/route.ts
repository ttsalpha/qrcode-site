import { type NextRequest, NextResponse } from "next/server";
import { fetchRemoteImage } from "@/lib/safe-fetch";

// Proxies a remote image so the Playground can rasterize it to canvas without
// tainting. Guarded against SSRF / hangs / oversized bodies via fetchRemoteImage.
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new NextResponse("missing url", { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new NextResponse("invalid url", { status: 400 });
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return new NextResponse("disallowed protocol", { status: 400 });
  }

  const image = await fetchRemoteImage(parsed);
  if (!image) {
    return new NextResponse("upstream error, blocked host, or not an image", {
      status: 502,
    });
  }

  return new NextResponse(new Uint8Array(image.buffer), {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=86400",
      // The body is attacker-controlled bytes served from our origin — stop the
      // browser sniffing it into HTML/script.
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
    },
  });
}
