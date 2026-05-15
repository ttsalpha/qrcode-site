import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "@ttsalpha/qrcode",
  description:
    "Lightweight, fully customizable React QR code library — pure SVG, zero dependencies, built from scratch.",
  keywords: ["qrcode", "react", "svg", "qr", "typescript"],
  openGraph: {
    title: "@ttsalpha/qrcode",
    description:
      "Lightweight, fully customizable React QR code library — pure SVG, zero dependencies, built from scratch.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value;
  const dataTheme = theme === "light" || theme === "dark" ? theme : undefined;

  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable}`}
      {...(dataTheme ? { "data-theme": dataTheme } : {})}
    >
      <body>{children}</body>
    </html>
  );
}
