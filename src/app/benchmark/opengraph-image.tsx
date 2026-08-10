import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Benchmark — @ttsalpha/qrcode";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    tag: "Performance",
    title: "Benchmark",
    subtitle:
      "Measured against qrcode.react, qr-code-styling, react-qr-code, and qrcode.",
    path: "/benchmark",
  });
}
