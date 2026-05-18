import { QRCode } from "@ttsalpha/qrcode";
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
import NavMenu from "@/components/NavMenu";
import PlaygroundLoader from "@/components/PlaygroundLoader";
import s from "./page.module.css";

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

export default function Page() {
  return (
    <>
      {/* Nav */}
      <nav className={s.nav}>
        <div className={s.navInner}>
          <a href="/" className={s.navBrand}>
            <span className={s.navBrandAt}>@ttsalpha/</span>qrcode
          </a>
          <NavMenu />
        </div>
      </nav>

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
                    size: 0.19,
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
                <CodeBlock
                  lang="bash"
                  code={`pnpm add @ttsalpha/qrcode
# npm install @ttsalpha/qrcode
# yarn add @ttsalpha/qrcode`}
                />
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
  size?: number;       // logo height as a fraction of QR size (0–1); default 0.2
  margin?: number;     // inset margin inside the cleared area; default 0
  hideDots?: boolean;  // clear dots behind logo area; default true
}`}
              />
              <p className={s.note}>
                Aspect ratio is auto-detected (
                <code>naturalWidth/naturalHeight</code> for <code>src</code>;{" "}
                <code>getBoundingClientRect</code> for <code>element</code>).
                Clamping is area-based: the masked width&nbsp;×&nbsp;height
                stays within the EC recovery budget — square logos are unchanged
                (L→15%, M→22%, Q→32%, H→40%), while landscape logos get a
                reduced height so they never overflow the QR. Use{" "}
                <code>errorCorrectionLevel: 'H'</code> for larger logos.
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

        {/* Examples */}
        <section className={`${s.section} ${s.sectionAlt}`} id="examples">
          <div className={s.wrap}>
            <SectionHead tag="Examples" title="Common patterns" />
            <div className={s.exampleList}>
              {/* 1. Default */}
              <Example
                title="Default"
                code={`<QRCode value="https://example.com" />`}
              >
                <QRCode value="https://example.com" size={160} />
              </Example>

              {/* 2. Rounded fluid dots */}
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

              {/* 3. Circle dots */}
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

              {/* 4. Accent color — same color everywhere */}
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

              {/* 5. Transparent background */}
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

              {/* 6. Logo */}
              <Example
                title="With logo — errorCorrectionLevel: 'H'"
                code={`<QRCode
  value="https://example.com"
  dotStyle="rounded"
  corner={{ square: { style: 'extra-rounded' } }}
  logo={{
    src: 'https://avatars.githubusercontent.com/u/48100204?size=64',
    size: 0.3,
    margin: 2,
  }}
  qr={{ errorCorrectionLevel: 'H' }}
/>`}
              >
                <QRCode
                  value="https://example.com"
                  size={160}
                  dotStyle="rounded"
                  corner={{ square: { style: "extra-rounded" } }}
                  logo={{
                    src: "https://avatars.githubusercontent.com/u/48100204?size=64",
                    size: 0.3,
                    margin: 2,
                  }}
                  qr={{ errorCorrectionLevel: "H" }}
                />
              </Example>

              {/* 7. Version 1 */}
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

      {/* Footer */}
      <footer className={s.footer}>
        <div className={s.wrap}>
          <div className={s.footerTop}>
            <div className={s.footerBrand}>
              <span className={s.footerBrandAt}>@ttsalpha/</span>qrcode
            </div>
            <nav className={s.footerNav}>
              <a
                href="https://github.com/ttsalpha"
                target="_blank"
                rel="noopener noreferrer"
                className={s.footerNavLink}
              >
                Author
              </a>
              <a
                href="https://github.com/ttsalpha/qrcode/releases"
                target="_blank"
                rel="noopener noreferrer"
                className={s.footerNavLink}
              >
                Changelog
              </a>

              <a
                href="https://github.com/ttsalpha/qrcode/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className={s.footerNavLink}
              >
                License
              </a>
            </nav>
          </div>
          <div className={s.footerBottom}>
            <span className={s.footerCopy}>
              © {new Date().getFullYear()}{" "}
              <a
                href="https://github.com/ttsalpha"
                target="_blank"
                rel="noopener noreferrer"
                className={s.footerLink}
              >
                Son Tran
              </a>{" "}
              · MIT License
            </span>
          </div>
        </div>
      </footer>
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
