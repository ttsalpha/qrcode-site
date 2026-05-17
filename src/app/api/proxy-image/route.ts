import { type NextRequest, NextResponse } from "next/server";

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

  const res = await fetch(url);
  if (!res.ok) {
    return new NextResponse("upstream error", { status: 502 });
  }

  const contentType =
    res.headers.get("content-type") ?? "application/octet-stream";
  const body = await res.arrayBuffer();

  return new NextResponse(body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
