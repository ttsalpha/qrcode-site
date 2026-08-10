import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Examples — @ttsalpha/qrcode";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    tag: "Documentation",
    title: "Examples",
    subtitle:
      "Copy-paste patterns for dot styles, corners, colors, logos, and export.",
    path: "/examples",
  });
}
