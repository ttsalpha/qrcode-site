import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt =
  "@ttsalpha/qrcode — customizable QR codes for React and React Native";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    tag: "React & React Native QR Code · MIT License",
    titlePrefix: "@ttsalpha/",
    title: "qrcode",
    subtitle:
      "Lightweight, fully customizable QR codes for React and React Native.",
  });
}
