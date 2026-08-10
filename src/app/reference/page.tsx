import type { Metadata } from "next";
import CodeBlock from "@/components/CodeBlock";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { AUTHOR, breadcrumb, pageMetadata, SITE_URL } from "@/lib/metadata";
import s from "./page.module.css";

const referenceDescription =
  "API reference for @ttsalpha/qrcode — every prop, type, export helper, and HTTP API param, with defaults and examples.";

export const metadata: Metadata = pageMetadata({
  title: "API Reference",
  description: referenceDescription,
  path: "/reference",
  keywords: [
    "qrcode props",
    "QRCode component API",
    "dotStyle",
    "CornerOptions",
    "LogoOptions",
    "toSVGString",
    "toDataURL",
    "QR code HTTP API",
  ],
});

const referenceJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      headline: "API Reference — @ttsalpha/qrcode",
      description: referenceDescription,
      url: `${SITE_URL}/reference`,
      proficiencyLevel: "Beginner",
      about: { "@type": "SoftwareSourceCode", name: "@ttsalpha/qrcode" },
      author: AUTHOR,
      publisher: AUTHOR,
    },
    breadcrumb("/reference", "API Reference"),
  ],
};

// ─── Content ──────────────────────────────────────────────────────────────────

type PropRow = { name: string; type: string; def: string; desc: string };

const QRCODE_PROPS: PropRow[] = [
  {
    name: "value",
    type: "string",
    def: "—",
    desc: "Data to encode (required)",
  },
  {
    name: "size",
    type: "number",
    def: "256",
    desc: "Width and height of the SVG in pixels",
  },
  {
    name: "margin",
    type: "number",
    def: "4",
    desc: "Quiet zone in modules",
  },
  {
    name: "dotStyle",
    type: "DotStyle",
    def: "'square'",
    desc: "Style of data modules",
  },
  {
    name: "dotColor",
    type: "string",
    def: "'#000000'",
    desc: "Color of data modules",
  },
  {
    name: "backgroundColor",
    type: "string",
    def: "'#ffffff'",
    desc: "Background — 'transparent' accepted",
  },
  {
    name: "corner",
    type: "CornerOptions",
    def: "—",
    desc: "Finder pattern corner styles",
  },
  { name: "logo", type: "LogoOptions", def: "—", desc: "Logo in center" },
  { name: "qr", type: "QROptions", def: "—", desc: "QR encoding options" },
  { name: "className", type: "string", def: "—", desc: "CSS class on <svg>" },
  {
    name: "style",
    type: "CSSProperties",
    def: "—",
    desc: "Inline style on <svg>",
  },
  {
    name: "ariaLabel",
    type: "string",
    def: "—",
    desc: "Accessible label for the SVG; defaults to 'QR code: {value}'",
  },
];

const DOT_STYLES: { value: string; desc: string }[] = [
  { value: "'square'", desc: "Full square (default)" },
  { value: "'circle'", desc: "Full circle" },
  {
    value: "'rounded'",
    desc: "Rounded; adjacent modules connect smoothly (fluid/snake effect)",
  },
];

const ECL_LEVELS: { level: string; recovery: string; useWhen: string }[] = [
  { level: "L", recovery: "~7%", useWhen: "Clean environments, minimal data" },
  { level: "M", recovery: "~15%", useWhen: "General purpose (default)" },
  { level: "Q", recovery: "~25%", useWhen: "Industrial / harsh conditions" },
  { level: "H", recovery: "~30%", useWhen: "QR codes with a center logo" },
];

const EXPORT_OPTIONS: PropRow[] = [
  {
    name: "format",
    type: "'png' | 'jpeg'",
    def: "'png'",
    desc: "Output image format",
  },
  {
    name: "quality",
    type: "number (0–1)",
    def: "browser default",
    desc: "JPEG quality. Ignored for PNG",
  },
];

const QR_PARAMS: PropRow[] = [
  {
    name: "data",
    type: "string",
    def: "—",
    desc: "Content to encode (required)",
  },
  {
    name: "format",
    type: "'svg' | 'png' | 'jpg'",
    def: "'svg'",
    desc: "Output image format",
  },
  {
    name: "size",
    type: "number (64–2048)",
    def: "256",
    desc: "Image size in px",
  },
  {
    name: "margin",
    type: "number (0–20)",
    def: "4",
    desc: "Quiet zone in modules",
  },
  {
    name: "dot",
    type: "'square' | 'circle' | 'rounded'",
    def: "'square'",
    desc: "Data module style",
  },
  { name: "color", type: "rrggbb", def: "000000", desc: "Data module color" },
  {
    name: "bg",
    type: "rrggbb | 'transparent'",
    def: "ffffff",
    desc: "Background color",
  },
  {
    name: "frame",
    type: "'square' | 'rounded' | 'extra-rounded' | 'circle'",
    def: "'square'",
    desc: "Finder frame style",
  },
  {
    name: "frameColor",
    type: "rrggbb",
    def: "color",
    desc: "Finder frame color",
  },
  {
    name: "eye",
    type: "'square' | 'rounded' | 'circle'",
    def: "derived",
    desc: "Finder center style",
  },
  {
    name: "eyeColor",
    type: "rrggbb",
    def: "color",
    desc: "Finder center color",
  },
  {
    name: "ecl",
    type: "'L' | 'M' | 'Q' | 'H'",
    def: "M *",
    desc: "Error correction level (* raised automatically when a logo is set)",
  },
  { name: "version", type: "number (1–40)", def: "auto", desc: "QR version" },
  { name: "logo", type: "url", def: "—", desc: "Center logo image URL" },
  {
    name: "logoSize",
    type: "number (0–1)",
    def: "0.4",
    desc: "Logo size relative to QR",
  },
  {
    name: "logoMargin",
    type: "number",
    def: "0",
    desc: "Space around the logo",
  },
  {
    name: "logoClear",
    type: "boolean",
    def: "true",
    desc: "Clear QR dots behind the logo",
  },
];

const CORNER_OPTIONS_CODE = `interface CornerOptions {
  dot?: {
    style?: 'square' | 'rounded' | 'circle'; // inner 3×3 block
    color?: string;
  };
  square?: {
    style?: 'square' | 'rounded' | 'extra-rounded' | 'circle'; // outer 7×7 ring
    color?: string;
  };
}`;

const LOGO_OPTIONS_CODE = `interface LogoOptions {
  src?: string;        // https, relative path, blob:, or data:image/… URI
  element?: ReactNode; // takes priority over src when both provided
  size?: number;       // 0–1 relative to max safe area; ECL auto-picked; default 0.4
  margin?: number;     // space between logo and edge of cleared area; default 0
  hideDots?: boolean;  // clear dots behind logo area; default true
}`;

const QR_OPTIONS_CODE = `interface QROptions {
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'; // default: 'M'
  version?: number; // 1–40, auto by default
}`;

const EXPORT_CODE = `import { toSVGString, toDataURL } from '@ttsalpha/qrcode';

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
link.click();`;

const HTTP_API_CODE = `<!-- SVG (default) -->
<img src="https://qrcode.ttsalpha.com/qr?data=https://example.com" alt="QR code" />

<!-- PNG output -->
<img src="https://qrcode.ttsalpha.com/qr?data=Hello&dot=rounded&color=14b8a6&format=png" />

<!-- With a center logo -->
<img src="https://qrcode.ttsalpha.com/qr?data=https://example.com&logo=https://example.com/logo.png" />`;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReferencePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(referenceJsonLd) }}
      />
      <SiteNav maxWidth={920} />
      <main>
        <section className={s.hero}>
          <div className={s.wrap}>
            <span className={s.heroTag}>Documentation</span>
            <h1 className={s.heroTitle}>API reference</h1>
            <p className={s.heroSub}>
              Every prop, type, helper, and HTTP API param, in one place.
            </p>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.wrap}>
            <Group id="qrcodeprops" title="QRCodeProps">
              <PropTable head="Prop" rows={QRCODE_PROPS} />
            </Group>

            <Group id="dotstyle" title="DotStyle">
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Value</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DOT_STYLES.map(({ value, desc }) => (
                      <tr key={value}>
                        <td>
                          <code>{value}</code>
                        </td>
                        <td>{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Group>

            <Group id="corneroptions" title="CornerOptions">
              <CodeBlock lang="ts" code={CORNER_OPTIONS_CODE} />
              <p className={s.note}>
                When <code>corner.square.style</code> is{" "}
                <code>'extra-rounded'</code> and <code>corner.dot.style</code>{" "}
                is unset, the dot defaults to <code>'rounded'</code>. When{" "}
                <code>corner.square.style</code> is <code>'circle'</code>, the
                dot defaults to <code>'circle'</code>.
              </p>
            </Group>

            <Group id="logooptions" title="LogoOptions">
              <CodeBlock lang="ts" code={LOGO_OPTIONS_CODE} />
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
            </Group>

            <Group id="qroptions" title="QROptions">
              <CodeBlock lang="ts" code={QR_OPTIONS_CODE} />
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
                    {ECL_LEVELS.map(({ level, recovery, useWhen }) => (
                      <tr key={level}>
                        <td>
                          <code>{level}</code>
                        </td>
                        <td>{recovery}</td>
                        <td>{useWhen}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Group>

            <Group id="exports" title="Export Helpers">
              <CodeBlock lang="ts" code={EXPORT_CODE} />
              <p className={s.note}>
                <code>toSVGString</code> accepts the same props as{" "}
                <code>{"<QRCode>"}</code> and returns a static SVG markup string
                — useful for SSR, saving to a database, or copying to clipboard.
                <br />
                <code>toDataURL</code> is browser-only (requires the Canvas
                API). JPEG automatically fills a white background when{" "}
                <code>backgroundColor</code> is <code>'transparent'</code>.
              </p>
              <PropTable head="Option" rows={EXPORT_OPTIONS} marginTop />
            </Group>

            <Group id="http-api" title="HTTP API — /qr">
              <p className={s.note} style={{ marginBottom: 14 }}>
                Render a QR straight from a URL, no install needed. Paste the
                link into any <code>{"<img>"}</code> tag, email, or doc. Pick
                the format with <code>format=svg|png|jpg</code> and pass colors
                as plain hex (<code>color=14b8a6</code>). The quickest way to
                build one: configure it in the{" "}
                <a href="/#playground" className={s.noteLink}>
                  playground
                </a>{" "}
                and hit “Copy link”. Output is deterministic per URL and cached
                on the CDN.
              </p>
              <CodeBlock lang="html" code={HTTP_API_CODE} />
              <PropTable head="Param" rows={QR_PARAMS} marginTop />
            </Group>
          </div>
        </section>
      </main>
      <SiteFooter maxWidth={920} showDocsLink />
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Group({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={s.apiGroup}>
      <h2 className={s.apiGroupTitle} id={id}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function PropTable({
  head,
  rows,
  marginTop,
}: {
  head: string;
  rows: PropRow[];
  marginTop?: boolean;
}) {
  return (
    <div
      className={s.tableWrap}
      style={marginTop ? { marginTop: 14 } : undefined}
    >
      <table className={s.table}>
        <thead>
          <tr>
            <th>{head}</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ name, type, def, desc }) => (
            <tr key={name}>
              <td>
                <code>{name}</code>
              </td>
              <td>
                <code>{type}</code>
              </td>
              <td>
                <code>{def}</code>
              </td>
              <td>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
