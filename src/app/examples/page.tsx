import { QRCode } from "@ttsalpha/qrcode";
import type { Metadata } from "next";
import CodeBlock from "@/components/CodeBlock";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import s from "./page.module.css";

const examplesDescription =
  "Code examples for @ttsalpha/qrcode — dot styles, corner styles, colors, logos, transparent background, and export helpers.";

export const metadata: Metadata = {
  title: "Examples",
  description: examplesDescription,
  alternates: { canonical: "/examples" },
  openGraph: {
    title: "Examples | @ttsalpha/qrcode",
    description: examplesDescription,
    url: "https://qrcode.ttsalpha.com/examples",
  },
  twitter: {
    title: "Examples | @ttsalpha/qrcode",
    description: examplesDescription,
  },
};

const examplesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "QR Code Examples — @ttsalpha/qrcode",
  description: examplesDescription,
  url: "https://qrcode.ttsalpha.com/examples",
  numberOfItems: 7,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Default square QR code" },
    {
      "@type": "ListItem",
      position: 2,
      name: "Rounded dots with extra-rounded corners",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Circle dots with circle corners",
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Accent corners with single color",
    },
    { "@type": "ListItem", position: 5, name: "Transparent background" },
    { "@type": "ListItem", position: 6, name: "With logo — ECL auto-picked" },
    { "@type": "ListItem", position: 7, name: "Version 1 — numeric data" },
  ],
};

export default function ExamplesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(examplesJsonLd) }}
      />
      <SiteNav maxWidth={860} />
      <main>
        <section className={s.hero}>
          <div className={s.wrap}>
            <span className={s.heroTag}>Examples</span>
            <h1 className={s.heroTitle}>Common patterns</h1>
            <p className={s.heroSub}>
              Copy-paste examples covering dot styles, corner styles, colors,
              logos, and export.
            </p>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.wrap}>
            <div className={s.exampleList}>
              <Example
                title="Default"
                code={`<QRCode value="https://example.com" />`}
              >
                <QRCode value="https://example.com" size={160} />
              </Example>

              <Example
                title="Rounded dots"
                code={`<QRCode
  value="https://example.com"
  dotStyle="rounded"
  corner={{ square: { style: 'extra-rounded' } }}
/>`}
              >
                <QRCode
                  value="https://example.com"
                  size={160}
                  dotStyle="rounded"
                  corner={{ square: { style: "extra-rounded" } }}
                />
              </Example>

              <Example
                title="Circle dots"
                code={`<QRCode
  value="https://example.com"
  dotStyle="circle"
  corner={{
    square: { style: 'circle' },
    dot: { style: 'circle' },
  }}
/>`}
              >
                <QRCode
                  value="https://example.com"
                  size={160}
                  dotStyle="circle"
                  corner={{
                    square: { style: "circle" },
                    dot: { style: "circle" },
                  }}
                />
              </Example>

              <Example
                title="Accent corners (single color)"
                code={`<QRCode
  value="https://example.com"
  dotStyle="rounded"
  corner={{
    square: { style: 'extra-rounded', color: '#14b8a6' },
    dot: { color: '#14b8a6' },
  }}
/>`}
              >
                <QRCode
                  value="https://example.com"
                  size={160}
                  dotStyle="rounded"
                  corner={{
                    square: { style: "extra-rounded", color: "#14b8a6" },
                    dot: { color: "#14b8a6" },
                  }}
                />
              </Example>

              <Example
                title="Transparent background"
                code={`<QRCode
  value="https://example.com"
  dotStyle="rounded"
  dotColor="#ffffff"
  backgroundColor="transparent"
  corner={{ square: { style: 'extra-rounded' } }}
/>`}
                dark
              >
                <QRCode
                  value="https://example.com"
                  size={160}
                  dotStyle="rounded"
                  dotColor="#ffffff"
                  backgroundColor="transparent"
                  corner={{ square: { style: "extra-rounded" } }}
                />
              </Example>

              <Example
                title="With logo — ECL auto-picked"
                code={`<QRCode
  value="https://example.com"
  dotStyle="rounded"
  corner={{ square: { style: 'extra-rounded' } }}
  logo={{
    src: 'https://avatars.githubusercontent.com/u/48100204?size=64',
    size: 0.5,
    margin: 2,
  }}
/>`}
              >
                <QRCode
                  value="https://example.com"
                  size={160}
                  dotStyle="rounded"
                  corner={{ square: { style: "extra-rounded" } }}
                  logo={{
                    src: "https://avatars.githubusercontent.com/u/48100204?size=64",
                    size: 0.5,
                    margin: 2,
                  }}
                />
              </Example>

              <Example
                title="Version 1 — numeric data"
                code={`<QRCode
  value="12345"
  qr={{ version: 1, errorCorrectionLevel: 'L' }}
/>`}
              >
                <QRCode
                  value="12345"
                  size={160}
                  qr={{ version: 1, errorCorrectionLevel: "L" }}
                />
              </Example>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter maxWidth={860} showDocsLink />
    </>
  );
}

function Example({
  title,
  code,
  children,
  dark,
}: {
  title: string;
  code: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className={s.exampleCard}>
      <div className={s.exampleCardTitle}>{title}</div>
      <div className={s.exampleCardBody}>
        <div
          className={`${s.exampleCardPreview} ${dark ? s.exampleCardPreviewDark : ""}`}
        >
          {children}
        </div>
        <div className={s.exampleCardCode}>
          <CodeBlock code={code} />
        </div>
      </div>
    </div>
  );
}
