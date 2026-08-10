import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt = "@ttsalpha/qrcode — customizable QR codes for React";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    tag: "React QR Code · MIT licensed",
    titlePrefix: "@ttsalpha/",
    title: "qrcode",
    subtitle:
      "Lightweight, fully customizable React QR code library. Built from scratch.",
  });
}
