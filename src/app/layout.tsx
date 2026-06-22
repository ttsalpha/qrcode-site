import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const siteUrl = "https://qrcode.ttsalpha.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "@ttsalpha/qrcode",
  title: {
    template: "%s | @ttsalpha/qrcode",
    default: "@ttsalpha/qrcode | QR Code Generator",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "@ttsalpha/qrcode",
    images: [{ url: "/og.jpeg", width: 800, height: 446 }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@ttsalpha",
    images: ["/og.jpeg"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
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
      <body>
        {children}
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
