import { QRCode } from "@ttsalpha/qrcode";
import type { Metadata } from "next";
import {
  IoAppsOutline,
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
import s from "./page.module.css";

const homeDescription =
  "Create and download custom QR codes instantly — or use as a React library: pure SVG, zero dependencies, fully typed.";

export const metadata: Metadata = {
  title: { absolute: "@ttsalpha/qrcode | QR Code Generator" },
  description: homeDescription,
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
  alternates: { canonical: "/" },
  openGraph: {
    title: "@ttsalpha/qrcode | QR Code Generator",
    description: homeDescription,
    url: "https://qrcode.ttsalpha.com",
  },
  twitter: {
    title: "@ttsalpha/qrcode | QR Code Generator",
    description: homeDescription,
  },
};

function SectionHead({
  tag,
  title,
  desc,
}: {
  tag: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className={s.sectionHead}>
      <span className={s.sectionTag}>{tag}</span>
      <h2 className={s.sectionTitle}>{title}</h2>
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
      url: "https://qrcode.ttsalpha.com",
      description:
        "Lightweight, fully customizable React QR code library — pure SVG, zero dependencies, built from scratch.",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      softwareVersion: "2.3.1",
      programmingLanguage: ["TypeScript", "JavaScript"],
      license: "https://github.com/ttsalpha/qrcode/blob/main/LICENSE",
      codeRepository: "https://github.com/ttsalpha/qrcode",
      downloadUrl: "https://www.npmjs.com/package/@ttsalpha/qrcode",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "WebApplication",
      name: "@ttsalpha/qrcode — QR Code Generator",
      url: "https://qrcode.ttsalpha.com",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
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
            text: "Most libs handle either SSR or styling — not both. qrcode.react is SSR-safe but has no styling API. qr-code-styling covers custom dots, colors, and logos but relies on Canvas and breaks server-side. This lib covers all of it: custom dot shapes, per-corner colors, logo support, pure SVG, SSR-safe. 2× faster cold start than qrcode.react, 20× faster styled renders than qr-code-styling.",
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
            text: 'Call toDataURL({ value: "..." }) in the browser. It returns a data URL you can attach to a download link. Use the format option for JPEG.',
          },
        },
        {
          "@type": "Question",
          name: "Does it support custom colors and dark mode?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Use dotColor for data modules, backgroundColor (accepts transparent), and the corner prop to color finder patterns independently.",
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
      <SiteNav maxWidth={860} />

      <main>
        {/* Hero */}
        <section className={s.hero}>
          <div className={s.wrap}>
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

            <h1 className={s.heroTitle}>
              <span className={s.heroTitleAt}>@ttsalpha/</span>qrcode
            </h1>
            <p className={s.heroSub}>
              Lightweight, fully customizable React QR code library.
              <br />
              Pure SVG · Zero dependencies · Built from scratch.
            </p>

            <div className={s.heroInstall}>
              <code>pnpm add @ttsalpha/qrcode</code>
              <CopyButton
                text="pnpm add @ttsalpha/qrcode"
                eventName="install_copy"
              />
            </div>

            <div className={s.heroPreviews}>
              <div className={s.heroPreviewItem}>
                <QRCode
                  value="@ttsalpha/qrcode"
                  size={168}
                  style={{ borderRadius: 12, overflow: "hidden" }}
                />
                <span className={s.heroPreviewLabel}>square</span>
              </div>
              <div
                className={`${s.heroPreviewItem} ${s.heroPreviewHideMobile}`}
              >
                <QRCode
                  value="https://github.com/ttsalpha/qrcode"
                  size={168}
                  dotStyle="rounded"
                  corner={{
                    square: { style: "extra-rounded", color: "#14b8a6" },
                    dot: { style: "rounded" },
                  }}
                  style={{ borderRadius: 12, overflow: "hidden" }}
                />
                <span className={s.heroPreviewLabel}>rounded</span>
              </div>
              <div className={s.heroPreviewItem}>
                <QRCode
                  value="@ttsalpha/qrcode"
                  size={168}
                  dotStyle="circle"
                  qr={{ errorCorrectionLevel: "H" }}
                  corner={{
                    square: { style: "circle", color: "#fe4f45" },
                    dot: { style: "circle", color: "#aa322c" },
                  }}
                  logo={{
                    src: "https://cdn.ttsalpha.com/qrcode/snow.svg",
                  }}
                  style={{ borderRadius: 12, overflow: "hidden" }}
                />
                <span className={s.heroPreviewLabel}>circle</span>
              </div>
            </div>
          </div>
        </section>

        {/* Playground */}
        <section className={`${s.section} ${s.sectionAlt}`} id="playground">
          <div className={s.wrap}>
            <SectionHead
              tag="Playground"
              title="Try it live"
              desc="Adjust every prop and see the result instantly."
            />
            <PlaygroundLoader />
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
            <SectionHead tag="API Reference" title="Props" />

            <div className={s.apiGroup}>
              <div className={s.apiGroupTitle}>QRCodeProps</div>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Prop</th>
                      <th>Type</th>
                      <th>Default</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["value", "string", "—", "Data to encode (required)"],
                      [
                        "size",
                        "number",
                        "256",
                        "Width and height of the SVG in pixels",
                      ],
                      ["margin", "number", "4", "Quiet zone in modules"],
                      [
                        "dotStyle",
                        "DotStyle",
                        "'square'",
                        "Style of data modules",
                      ],
                      [
                        "dotColor",
                        "string",
                        "'#000000'",
                        "Color of data modules",
                      ],
                      [
                        "backgroundColor",
                        "string",
                        "'#ffffff'",
                        "Background — 'transparent' accepted",
                      ],
                      [
                        "corner",
                        "CornerOptions",
                        "—",
                        "Finder pattern corner styles",
                      ],
                      ["logo", "LogoOptions", "—", "Logo in center"],
                      ["qr", "QROptions", "—", "QR encoding options"],
                      ["className", "string", "—", "CSS class on <svg>"],
                      ["style", "CSSProperties", "—", "Inline style on <svg>"],
                      [
                        "ariaLabel",
                        "string",
                        "—",
                        "Accessible label for the SVG; defaults to 'QR code: {value}'",
                      ],
                    ].map(([p, t, d, desc]) => (
                      <tr key={p}>
                        <td>
                          <code>{p}</code>
                        </td>
                        <td>
                          <code>{t}</code>
                        </td>
                        <td>
                          <code>{d}</code>
                        </td>
                        <td>{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={s.apiGroup}>
              <div className={s.apiGroupTitle}>DotStyle</div>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Value</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["'square'", "Full square (default)"],
                      ["'circle'", "Full circle"],
                      [
                        "'rounded'",
                        "Rounded; adjacent modules connect smoothly (fluid/snake effect)",
                      ],
                    ].map(([v, d]) => (
                      <tr key={v}>
                        <td>
                          <code>{v}</code>
                        </td>
                        <td>{d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={s.apiGroup}>
              <div className={s.apiGroupTitle}>CornerOptions</div>
              <CodeBlock
                lang="ts"
                code={`interface CornerOptions {
  dot?: {
    style?: 'square' | 'rounded' | 'circle'; // inner 3×3 block
    color?: string;
  };
  square?: {
    style?: 'square' | 'rounded' | 'extra-rounded' | 'circle'; // outer 7×7 ring
    color?: string;
  };
}`}
              />
              <p className={s.note}>
                When <code>corner.square.style</code> is{" "}
                <code>'extra-rounded'</code> and <code>corner.dot.style</code>{" "}
                is unset, the dot defaults to <code>'rounded'</code>. When{" "}
                <code>corner.square.style</code> is <code>'circle'</code>, the
                dot defaults to <code>'circle'</code>.
              </p>
            </div>

            <div className={s.apiGroup}>
              <div className={s.apiGroupTitle}>LogoOptions</div>
              <CodeBlock
                lang="ts"
                code={`interface LogoOptions {
  src?: string;        // https, relative path, blob:, or data:image/… URI
  element?: ReactNode; // takes priority over src when both provided
  size?: number;       // 0–1 relative to max safe area; ECL auto-picked; default 0.4
  margin?: number;     // space between logo and edge of cleared area; default 0
  hideDots?: boolean;  // clear dots behind logo area; default true
}`}
              />
              <p className={s.note}>
                ECL is auto-picked based on <code>size</code>:{" "}
                <code>≤&nbsp;0.25</code> → L (≤&nbsp;15% width),{" "}
                <code>≤&nbsp;0.44</code> → M (≤&nbsp;20%),{" "}
                <code>≤&nbsp;0.69</code> → Q (≤&nbsp;25%),{" "}
                <code>≤&nbsp;1.0</code> → H (≤&nbsp;30%). If{" "}
                <code>errorCorrectionLevel</code> is set explicitly, the size is
                clamped to that ECL's safe limit. Aspect ratio is auto-detected
                — landscape logos get a proportionally reduced height so they
                never overflow the QR.
                <br />
                <code>hideDots</code> uses an SVG mask, so transparent
                backgrounds are fully supported.
              </p>
              <p className={s.note}>
                <strong>Security:</strong> <code>javascript:</code> and
                non-image <code>data:</code> URIs in <code>src</code> are
                silently rejected. Never pass unsanitised user input as{" "}
                <code>element</code> — it renders verbatim inside{" "}
                <code>{"<foreignObject>"}</code>.
              </p>
            </div>

            <div className={s.apiGroup}>
              <div className={s.apiGroupTitle}>QROptions</div>
              <CodeBlock
                lang="ts"
                code={`interface QROptions {
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'; // default: 'M'
  version?: number; // 1–40, auto by default
}`}
              />
              <div className={s.tableWrap} style={{ marginTop: 14 }}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Recovery</th>
                      <th>Use when</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["L", "~7%", "Clean environments, minimal data"],
                      ["M", "~15%", "General purpose (default)"],
                      ["Q", "~25%", "Industrial / harsh conditions"],
                      ["H", "~30%", "QR codes with a center logo"],
                    ].map(([l, r, u]) => (
                      <tr key={l}>
                        <td>
                          <code>{l}</code>
                        </td>
                        <td>{r}</td>
                        <td>{u}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className={s.apiGroup} id="exports">
              <div className={s.apiGroupTitle}>Export Helpers</div>
              <CodeBlock
                lang="ts"
                code={`import { toSVGString, toDataURL } from '@ttsalpha/qrcode';

// Server-side SVG string — no DOM needed
const svg = toSVGString({ value: 'https://example.com', size: 512 });

// PNG data URL via Canvas (browser-only)
const png = await toDataURL({ value: 'https://example.com', size: 512 });

// JPEG with quality
const jpg = await toDataURL(
  { value: 'https://example.com', size: 512 },
  { format: 'jpeg', quality: 0.9 },
);

// Download link
const link = document.createElement('a');
link.href = await toDataURL({ value: 'https://example.com' });
link.download = 'qrcode.png';
link.click();`}
              />
              <p className={s.note}>
                <code>toSVGString</code> accepts the same props as{" "}
                <code>{"<QRCode>"}</code> and returns a static SVG markup string
                — useful for SSR, saving to a database, or copying to clipboard.
                <br />
                <code>toDataURL</code> is browser-only (requires the Canvas
                API). JPEG automatically fills a white background when{" "}
                <code>backgroundColor</code> is <code>'transparent'</code>.
              </p>
              <div className={s.tableWrap} style={{ marginTop: 14 }}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Option</th>
                      <th>Type</th>
                      <th>Default</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [
                        "format",
                        "'png' | 'jpeg'",
                        "'png'",
                        "Output image format",
                      ],
                      [
                        "quality",
                        "number (0–1)",
                        "browser default",
                        "JPEG quality. Ignored for PNG",
                      ],
                    ].map(([p, t, d, desc]) => (
                      <tr key={p}>
                        <td>
                          <code>{p}</code>
                        </td>
                        <td>
                          <code>{t}</code>
                        </td>
                        <td>
                          <code>{d}</code>
                        </td>
                        <td>{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className={`${s.section} ${s.sectionAlt}`} id="faq">
          <div className={s.wrap}>
            <SectionHead tag="FAQ" title="Frequently asked questions" />
            <div className={s.faqList}>
              <details className={s.faqItem}>
                <summary className={s.faqQ}>
                  How is this different from other QR code libraries?
                </summary>
                <p className={s.faqA}>
                  Most libs handle either SSR or styling — not both.{" "}
                  <code>qrcode.react</code> is SSR-safe but has no styling API.{" "}
                  <code>qr-code-styling</code> covers custom dots, colors, and
                  logos but relies on Canvas and breaks server-side. This lib
                  covers all of it: custom dot shapes, per-corner colors, logo
                  support, pure SVG, SSR-safe. 2× faster cold start than{" "}
                  <code>qrcode.react</code>, 20× faster styled renders than{" "}
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
                  <summary className={s.faqQ}>{q}</summary>
                  <p className={s.faqA}>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter maxWidth={860} />
    </>
  );
}
