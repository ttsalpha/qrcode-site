import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const siteUrl = "https://qrcode.ttsalpha.com";
const description =
  "Lightweight, fully customizable React QR code library — pure SVG, zero dependencies, built from scratch.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "@ttsalpha/qrcode",
  description,
  keywords: ["qrcode", "react", "svg", "qr", "typescript"],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "@ttsalpha/qrcode",
    description,
    type: "website",
    url: siteUrl,
    siteName: "@ttsalpha/qrcode",
    images: [{ url: "/og.jpeg", width: 800, height: 446 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "@ttsalpha/qrcode",
    description,
    images: ["/og.jpeg"],
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
      <Analytics />
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
