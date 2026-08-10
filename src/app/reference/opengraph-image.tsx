import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt = "API reference — @ttsalpha/qrcode";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    tag: "Documentation",
    title: "API reference",
    subtitle: "Every prop, type, helper, and HTTP API param, in one place.",
    path: "/reference",
  });
}
