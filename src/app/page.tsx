import type { Metadata } from "next";
import {
  IoAppsOutline,
  IoChevronDown,
  IoCloudDownloadOutline,
  IoCodeSlashOutline,
  IoCubeOutline,
  IoFlashOutline,
  IoImageOutline,
  IoScanOutline,
  IoShapesOutline,
} from "react-icons/io5";
import CodeBlock from "@/components/CodeBlock";
import CopyButton from "@/components/CopyButton";
import PlaygroundLoader from "@/components/PlaygroundLoader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { AUTHOR, pageMetadata, SITE_URL } from "@/lib/metadata";
import s from "./page.module.css";

const homeDescription =
  "Create and download custom QR codes instantly — or use as a React library: pure SVG, zero dependencies, fully typed.";

export const metadata: Metadata = pageMetadata({
  titleAbsolute: "@ttsalpha/qrcode | QR Code Generator",
  description: homeDescription,
  path: "/",
  keywords: [
    "qrcode",
    "react",
    "svg",
    "qr",
    "typescript",
    "npm",
    "React QR code",
    "QR code component",
    "customizable QR code",
    "zero dependency",
    "SVG QR code",
    "QR code generator",
  ],
});

function SectionHead({
  tag,
  title,
  desc,
  as: Heading = "h2",
}: {
  tag?: string;
  title: string;
  desc?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={s.sectionHead}>
      {tag && <span className={s.sectionTag}>{tag}</span>}
      <Heading className={s.sectionTitle}>{title}</Heading>
      {desc && <p className={s.sectionDesc}>{desc}</p>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "@ttsalpha/qrcode",
      url: SITE_URL,
      description:
        "Lightweight, fully customizable React QR code library — pure SVG, zero dependencies, built from scratch.",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      softwareVersion: "2.4.3",
      programmingLanguage: ["TypeScript", "JavaScript"],
      license: "https://github.com/ttsalpha/qrcode/blob/main/LICENSE",
      codeRepository: "https://github.com/ttsalpha/qrcode",
      downloadUrl: "https://www.npmjs.com/package/@ttsalpha/qrcode",
      author: AUTHOR,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "WebApplication",
      name: "@ttsalpha/qrcode — QR Code Generator",
      url: SITE_URL,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      author: AUTHOR,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How is this different from other QR code libraries?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Most libs handle either SSR or styling — not both. qrcode.react is SSR-safe but has no styling API. qr-code-styling covers custom dots, colors, and logos but relies on Canvas and breaks server-side. This lib covers all of it: custom dot shapes, per-corner colors, logo support, pure SVG, SSR-safe. 4× faster cold start than qrcode.react, 38× faster styled renders than qr-code-styling.",
          },
        },
        {
          "@type": "Question",
          name: "Does it work with Next.js and server-side rendering?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The library is pure SVG — no DOM, no Canvas. The QRCode component renders server-side in Next.js App Router and works on Edge runtimes. For SSR without React, use toSVGString().",
          },
        },
        {
          "@type": "Question",
          name: "Can I generate QR codes without React (Node.js, CLI, email templates)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. toSVGString() produces a static SVG string — no DOM or React required. toDataURL() is browser-only as it requires the Canvas API.",
          },
        },
        {
          "@type": "Question",
          name: "How do I add a logo to the center of a QR code?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Use the logo prop with src for an image URL, or element for any React node. Error correction level is auto-picked based on logo size to keep the code scannable.",
          },
        },
        {
          "@type": "Question",
          name: "How do I export a QR code as PNG or JPEG?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Call toDataURL() in the browser — it returns a data URL you can attach to a download link. Use the format option for JPEG.",
          },
        },
        {
          "@type": "Question",
          name: "Does it support custom colors and dark mode?",
          acceptedAnswer: {
            "@type": "Answer",
            text: 'Yes. Use dotColor for data modules, backgroundColor (accepts "transparent"), and the corner prop to color finder patterns independently. Pair with your own dark-mode logic to switch colors at runtime.',
          },
        },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteNav />

      <main>
        {/* Playground */}
        <section className={`${s.section} ${s.sectionFirst}`} id="playground">
          <div className={s.wrap}>
            <SectionHead
              title="Make your QR code"
              desc="Type a link or text, pick a style, download the image. Free, no sign-up."
              as="h1"
            />
            <PlaygroundLoader />
          </div>
        </section>

        {/* Hero */}
        <section className={`${s.hero} ${s.sectionAlt}`}>
          <div className={s.wrap}>
            <span className={s.sectionTag}>Open Source</span>
            <h2 className={s.heroTitle}>
              <span className={s.heroTitleAt}>@ttsalpha/</span>qrcode
            </h2>
            <p className={s.heroSub}>
              Lightweight, fully customizable React QR code library.
              <br />
              Pure SVG · Zero dependencies · Built from scratch.
            </p>

            <div className={s.heroBadges}>
              <a
                href="https://www.npmjs.com/package/@ttsalpha/qrcode"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* biome-ignore lint/performance/noImgElement: external badge SVG, next/image doesn't support shields.io */}
                <img
                  src="https://img.shields.io/npm/v/@ttsalpha/qrcode"
                  alt="npm version"
                  height={20}
                  width={90}
                  style={{ width: "auto" }}
                />
              </a>
              <a
                href="https://github.com/ttsalpha/qrcode/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* biome-ignore lint/performance/noImgElement: external badge SVG, next/image doesn't support shields.io */}
                <img
                  src="https://img.shields.io/npm/l/@ttsalpha/qrcode"
                  alt="license"
                  height={20}
                  width={80}
                  style={{ width: "auto" }}
                />
              </a>
              <a
                href="https://github.com/ttsalpha/qrcode/actions/workflows/ci.yml"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* biome-ignore lint/performance/noImgElement: external badge SVG, next/image doesn't support shields.io */}
                <img
                  src="https://img.shields.io/github/actions/workflow/status/ttsalpha/qrcode/ci.yml?label=CI"
                  alt="CI status"
                  height={20}
                  width={80}
                  style={{ width: "auto" }}
                />
              </a>
            </div>

            <div className={s.heroInstall}>
              <code>pnpm add @ttsalpha/qrcode</code>
              <CopyButton
                text="pnpm add @ttsalpha/qrcode"
                eventName="install_copy"
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className={s.section} id="features">
          <div className={s.wrap}>
            <SectionHead tag="Features" title="What's included" />
            <div className={s.featureGrid}>
              {[
                {
                  icon: <IoShapesOutline size={22} />,
                  name: "Pure SVG",
                  desc: "No canvas, no raster. Scales perfectly at any resolution — print or screen.",
                },
                {
                  icon: <IoCubeOutline size={22} />,
                  name: "Zero dependencies",
                  desc: "QR encoding built from scratch per ISO/IEC 18004. React is the only peer dep.",
                },
                {
                  icon: <IoAppsOutline size={22} />,
                  name: "3 dot styles",
                  desc: "Square, circle, and snake-connected rounded — mix freely with corner styles.",
                },
                {
                  icon: <IoScanOutline size={22} />,
                  name: "Customizable corners",
                  desc: "Independent style and color for each finder pattern part (dot and square ring).",
                },
                {
                  icon: <IoImageOutline size={22} />,
                  name: "Logo support",
                  desc: "Embed any image URL or React node in the center. Size auto-clamped per ECL to stay scannable.",
                },
                {
                  icon: <IoCodeSlashOutline size={22} />,
                  name: "Fully typed",
                  desc: "Strict TypeScript throughout. Full IntelliSense on every prop.",
                },
                {
                  icon: <IoFlashOutline size={22} />,
                  name: "Tree-shakeable",
                  desc: "Named exports, ESM + CJS output. Minimal bundle impact.",
                },
                {
                  icon: <IoCloudDownloadOutline size={22} />,
                  name: "Export helpers",
                  desc: "toSVGString() generates SVG server-side without DOM. toDataURL() renders PNG/JPEG via Canvas.",
                },
              ].map((f) => (
                <div key={f.name} className={s.featureCard}>
                  <div className={s.featureIcon} aria-hidden="true">
                    {f.icon}
                  </div>
                  <div className={s.featureName}>{f.name}</div>
                  <div className={s.featureDesc}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Installation */}
        <section className={`${s.section} ${s.sectionAlt}`} id="installation">
          <div className={s.wrap}>
            <SectionHead tag="Installation" title="Get started" />
            <div className={s.installGrid}>
              <div>
                <p className={s.installLabel}>Install</p>
                <CodeBlock lang="bash" code={`pnpm add @ttsalpha/qrcode`} />
              </div>
              <div>
                <p className={s.installLabel}>Quick start</p>
                <CodeBlock
                  code={`import { QRCode } from '@ttsalpha/qrcode';

export default function App() {
  return <QRCode value="https://example.com" />;
}`}
                />
              </div>
            </div>
            <p className={s.note} style={{ marginTop: 20 }}>
              React 18+ is required as a peer dependency.
            </p>
          </div>
        </section>

        {/* API Reference */}
        <section className={s.section} id="api">
          <div className={s.wrap}>
            <SectionHead
              tag="API Reference"
              title="Props, types and helpers"
              desc="Full reference lives on its own page — props, corner and logo options, export helpers, and the HTTP API params."
            />
            <div className={s.apiLinks}>
              <a href="/reference#qrcodeprops" className={s.apiLinkCard}>
                <div className={s.apiLinkName}>QRCodeProps</div>
                <div className={s.apiLinkDesc}>
                  Every prop on {"<QRCode>"} with types and defaults
                </div>
              </a>
              <a href="/reference#exports" className={s.apiLinkCard}>
                <div className={s.apiLinkName}>Export Helpers</div>
                <div className={s.apiLinkDesc}>
                  toSVGString and toDataURL for SVG, PNG, JPEG
                </div>
              </a>
              <a href="/reference#http-api" className={s.apiLinkCard}>
                <div className={s.apiLinkName}>HTTP API</div>
                <div className={s.apiLinkDesc}>
                  Render a QR from a URL, no install needed
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className={`${s.section} ${s.sectionAlt}`} id="faq">
          <div className={s.wrap}>
            <SectionHead tag="FAQ" title="Frequently asked questions" />
            <div className={s.faqList}>
              <details className={s.faqItem} open>
                <summary className={s.faqQ}>
                  <span>
                    How is this different from other QR code libraries?
                  </span>
                  <IoChevronDown className={s.faqChevron} />
                </summary>
                <p className={s.faqA}>
                  Most libs handle either SSR or styling — not both.{" "}
                  <code>qrcode.react</code> is SSR-safe but has no styling API.{" "}
                  <code>qr-code-styling</code> covers custom dots, colors, and
                  logos but relies on Canvas and breaks server-side. This lib
                  covers all of it: custom dot shapes, per-corner colors, logo
                  support, pure SVG, SSR-safe. 4× faster cold start than{" "}
                  <code>qrcode.react</code>, 38× faster styled renders than{" "}
                  <code>qr-code-styling</code>.{" "}
                  <a href="/benchmark" className={s.faqLink}>
                    See the benchmark →
                  </a>
                </p>
              </details>
              {[
                {
                  q: "Does it work with Next.js and server-side rendering?",
                  a: (
                    <>
                      Yes. The library is pure SVG — no DOM, no Canvas. The{" "}
                      <code>QRCode</code> component renders server-side in
                      Next.js App Router and works on Edge runtimes. For SSR
                      without React, use <code>toSVGString()</code>.
                    </>
                  ),
                },
                {
                  q: "Can I generate QR codes without React (Node.js, CLI, email templates)?",
                  a: (
                    <>
                      Yes. <code>toSVGString()</code> produces a static SVG
                      string — no DOM or React required.{" "}
                      <code>toDataURL()</code> is browser-only as it requires
                      the Canvas API.
                    </>
                  ),
                },
                {
                  q: "How do I add a logo to the center of a QR code?",
                  a: (
                    <>
                      Use the <code>logo</code> prop with <code>src</code> for
                      an image URL, or <code>element</code> for any React node.
                      Error correction level is auto-picked based on logo size
                      to keep the code scannable.
                    </>
                  ),
                },
                {
                  q: "How do I export a QR code as PNG or JPEG?",
                  a: (
                    <>
                      Call <code>toDataURL()</code> in the browser — it returns
                      a data URL you can attach to a download link. Use the{" "}
                      <code>format</code> option for JPEG.
                    </>
                  ),
                },
                {
                  q: "Does it support custom colors and dark mode?",
                  a: (
                    <>
                      Yes. Use <code>dotColor</code> for data modules,{" "}
                      <code>backgroundColor</code> (accepts{" "}
                      <code>"transparent"</code>), and the <code>corner</code>{" "}
                      prop to color finder patterns independently. Pair with
                      your own dark-mode logic to switch colors at runtime.
                    </>
                  ),
                },
              ].map(({ q, a }) => (
                <details key={q} className={s.faqItem}>
                  <summary className={s.faqQ}>
                    <span>{q}</span>
                    <IoChevronDown className={s.faqChevron} />
                  </summary>
                  <p className={s.faqA}>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
