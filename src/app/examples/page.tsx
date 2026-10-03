import { QRCode } from "@ttsalpha/qrcode";
import type { Metadata } from "next";
import CodeBlock from "@/components/CodeBlock";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { AUTHOR, breadcrumb, pageMetadata, SITE_URL } from "@/lib/metadata";
import s from "./page.module.css";

const examplesDescription =
  "Code examples for @ttsalpha/qrcode: dot styles, corner styles, colors, logos, rounded logos, transparent background, React Native, and export helpers.";

export const metadata: Metadata = pageMetadata({
  title: "Examples",
  description: examplesDescription,
  path: "/examples",
});

const examplesJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      name: "QR Code Examples — @ttsalpha/qrcode",
      description: examplesDescription,
      url: `${SITE_URL}/examples`,
      author: AUTHOR,
      publisher: AUTHOR,
    },
    breadcrumb("/examples", "Examples"),
    {
      "@type": "ItemList",
      name: "QR Code Examples — @ttsalpha/qrcode",
      url: `${SITE_URL}/examples`,
      numberOfItems: 9,
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
        {
          "@type": "ListItem",
          position: 6,
          name: "With logo — ECL auto-picked",
        },
        { "@type": "ListItem", position: 7, name: "Rounded logo" },
        { "@type": "ListItem", position: 8, name: "Version 1 — numeric data" },
        { "@type": "ListItem", position: 9, name: "React Native and Expo" },
      ],
    },
  ],
};

export default function ExamplesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(examplesJsonLd) }}
      />
      <SiteNav />
      <main>
        <section className={s.hero}>
          <div className={s.wrap}>
            <span className={s.heroTag}>Documentation</span>
            <h1 className={s.heroTitle}>Examples</h1>
            <p className={s.heroSub}>
              Copy-paste examples covering dot styles, corner styles, colors,
              logos, React Native, and export.
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
    margin: 0.5,
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
                    margin: 0.5,
                  }}
                />
              </Example>

              <Example
                title="Rounded logo"
                code={`<QRCode
  value="https://example.com"
  dotStyle="rounded"
  corner={{ square: { style: 'extra-rounded' } }}
  logo={{
    src: 'https://avatars.githubusercontent.com/u/48100204?size=64',
    size: 0.5,
    margin: 0.5,
    radius: 1,
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
                    margin: 0.5,
                    radius: 1,
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

              <Example
                title="React Native and Expo (preview drawn on the web)"
                code={`import { QRCode } from '@ttsalpha/qrcode/native';

<QRCode
  value="https://example.com"
  size={240}
  dotStyle="rounded"
  corner={{ square: { style: 'extra-rounded' } }}
  logo={{ src: require('./logo.png'), radius: 0.3 }}
  onError={(error) => console.warn(error.message)}
/>`}
              >
                <QRCode
                  value="https://example.com"
                  size={160}
                  dotStyle="rounded"
                  corner={{ square: { style: "extra-rounded" } }}
                  logo={{
                    src: "https://avatars.githubusercontent.com/u/48100204?size=64",
                    radius: 0.3,
                  }}
                />
              </Example>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter showDocsLink />
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
