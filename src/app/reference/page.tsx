import type { Metadata } from "next";
import CodeBlock from "@/components/CodeBlock";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { AUTHOR, breadcrumb, pageMetadata, SITE_URL } from "@/lib/metadata";
import s from "./page.module.css";

const referenceDescription =
  "API reference for @ttsalpha/qrcode: every prop, type, entry point, React Native option, export helper, and HTTP API param, with defaults and examples.";

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
    "React Native QR code",
    "Expo QR code",
    "buildQR",
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
    desc: "Background color, 'transparent' accepted",
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
  {
    name: "idPrefix",
    type: "string",
    def: "'qr'",
    desc: "Prefix for generated ids; toSVGString only, for two identical codes on one page",
  },
];

const ENTRY_POINTS: { entry: string; contents: string; needs: string }[] = [
  {
    entry: "@ttsalpha/qrcode",
    contents: "<QRCode>, toSVGString, toDataURL",
    needs: "React 18+",
  },
  {
    entry: "@ttsalpha/qrcode/server",
    contents: "toSVGString, toDataURL, no client boundary",
    needs: "nothing (toDataURL needs a browser)",
  },
  {
    entry: "@ttsalpha/qrcode/native",
    contents: "<QRCode> for React Native and Expo",
    needs: "React 18+, react-native-svg",
  },
  {
    entry: "@ttsalpha/qrcode/core",
    contents: "buildQR, toSVGString",
    needs: "nothing",
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

const NATIVE_PROPS: PropRow[] = [
  {
    name: "logo",
    type: "NativeLogoOptions",
    def: "—",
    desc: "Logo in the center; see below",
  },
  {
    name: "ariaLabel",
    type: "string",
    def: "—",
    desc: "Becomes accessibilityLabel; defaults to 'QR code: {value}'",
  },
  {
    name: "onError",
    type: "(error: Error) => void",
    def: "—",
    desc: "Called when the symbol cannot be drawn; the component renders nothing instead of throwing",
  },
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
  {
    name: "scale",
    type: "number",
    def: "1",
    desc: "Raster size multiplier, for exporting above the on-screen size",
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
    desc: "Space around the logo, in modules",
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
  aspectRatio?: number; // width / height; measured from src when omitted
  margin?: number;     // space between logo and cleared area, in modules; default 0
  hideDots?: boolean;  // clear dots behind logo area; default true
  radius?: number;     // corner radius, 0 (square) to 1 (fully rounded); default 0
}`;

const QR_OPTIONS_CODE = `interface QROptions {
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'; // default: 'M'
  version?: number; // 1–40, auto by default
}`;

const NATIVE_CODE = `import { QRCode } from '@ttsalpha/qrcode/native';

export default function Pay() {
  return (
    <QRCode
      value="https://example.com"
      size={240}
      dotStyle="rounded"
      corner={{ square: { style: 'extra-rounded' } }}
      logo={{ src: require('./logo.png'), radius: 0.3 }}
      onError={(error) => console.warn(error.message)}
    />
  );
}`;

const NATIVE_LOGO_CODE = `interface NativeLogoOptions {
  src?: string | number; // a URL, or a local asset from require('./logo.png')
  svg?: string;          // the logo as SVG markup; wins over src
  size?: number;         // as in LogoOptions
  aspectRatio?: number;  // native cannot measure an image: square unless set
  margin?: number;       // as in LogoOptions
  hideDots?: boolean;    // as in LogoOptions
  radius?: number;       // as in LogoOptions
}`;

const NATIVE_IMAGE_CODE = `import Svg from 'react-native-svg';

const ref = useRef<React.ElementRef<typeof Svg>>(null);

<QRCode ref={ref} value="https://example.com" />;

ref.current?.toDataURL((base64) => {
  // PNG, base64 without the data: prefix
});`;

const CORE_CODE = `import { buildQR } from '@ttsalpha/qrcode/core';

const geometry = buildQR({ value: 'https://example.com', size: 256 });

interface QRGeometry {
  size: number; // rendered width and height
  viewBox: number; // side of the square viewBox
  ecLevel: 'L' | 'M' | 'Q' | 'H'; // after logo sizing
  background?: string; // absent when transparent
  modules?: { d: string; fill: string }; // all data modules, one path
  finders: Array<{
    square: { d: string; fill: string; fillRule?: 'evenodd' }; // 7×7 ring
    dot: { d: string; fill: string }; // 3×3 dot
  }>;
  clear?: { x: number; y: number; width: number; height: number }; // cut out of the dots
  logo?: { x: number; y: number; width: number; height: number; radius: number; src?: string };
  warnings: string[];
}`;

const EXPORT_CODE = `import { toSVGString, toDataURL } from '@ttsalpha/qrcode';

// From a React Server Component or any server-only module, import the
// entry with no client boundary:
// import { toSVGString } from '@ttsalpha/qrcode/server';

// Server-side SVG string, no DOM, no React
const svg = toSVGString({ value: 'https://example.com', size: 512 });

// PNG data URL via Canvas (browser-only)
const png = await toDataURL({ value: 'https://example.com', size: 512 });

// Two-times pixel density for print or retina
const png2x = await toDataURL(
  { value: 'https://example.com', size: 512 },
  { scale: 2 },
);

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
      <SiteNav />
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
            <Group id="entrypoints" title="Entry points">
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Import from</th>
                      <th>Contents</th>
                      <th>Needs at runtime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ENTRY_POINTS.map(({ entry, contents, needs }) => (
                      <tr key={entry}>
                        <td>
                          <code>{entry}</code>
                        </td>
                        <td>{contents}</td>
                        <td>{needs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Group>

            <Group id="qrcodeprops" title="QRCodeProps">
              <PropTable head="Prop" rows={QRCODE_PROPS} />
              <p className={s.note}>
                <code>{"<QRCode>"}</code> also forwards a <code>ref</code> to
                the <code>{"<svg>"}</code> element and passes through any other
                SVG attribute, such as <code>id</code>, <code>onClick</code> or{" "}
                <code>data-*</code>. <code>toSVGString</code> reads only the
                props above.
              </p>
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
                clamped to that ECL's safe limit. Aspect ratio is auto-detected:
                landscape logos get a proportionally reduced height so they
                never overflow the QR.
                <br />
                <code>hideDots</code> uses an SVG mask, so transparent
                backgrounds are fully supported.
                <br />
                <code>radius</code> is a share of the logo's shorter side, so{" "}
                <code>1</code> turns a square logo into a circle. It clips{" "}
                <code>src</code> and <code>element</code> alike.
              </p>
              <p className={s.note}>
                <strong>Security:</strong> <code>javascript:</code> and
                non-image <code>data:</code> URIs in <code>src</code> are
                silently rejected. Never pass unsanitised user input as{" "}
                <code>element</code>, which renders verbatim inside{" "}
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
                <code>toSVGString</code> takes the props in the table above and
                returns a static SVG markup string, useful for SSR, saving to a
                database, or copying to clipboard. It renders without React, so{" "}
                <code>logo.element</code> throws; pass <code>logo.src</code>{" "}
                instead, or render <code>{"<QRCode>"}</code>.
                <br />
                Import from <code>@ttsalpha/qrcode/server</code> inside a React
                Server Component. The root entry is a client boundary, so every
                export of it becomes a client reference there.
                <br />
                <code>@ttsalpha/qrcode/core</code> exports the same{" "}
                <code>toSVGString</code>, typed without React. It is plain
                JavaScript, so React Native apps import it from there.
                <br />
                <code>toDataURL</code> is browser-only (requires the Canvas
                API). JPEG automatically fills a white background when{" "}
                <code>backgroundColor</code> is <code>'transparent'</code>.
              </p>
              <PropTable head="Option" rows={EXPORT_OPTIONS} marginTop />
            </Group>

            <Group id="react-native" title="React Native and Expo">
              <p className={s.note} style={{ marginBottom: 14 }}>
                <code>@ttsalpha/qrcode/native</code> draws the same symbols as{" "}
                <code>{"<QRCode>"}</code> with{" "}
                <a
                  href="https://github.com/software-mansion/react-native-svg"
                  className={s.noteLink}
                >
                  react-native-svg
                </a>
                , which is an optional peer dependency. Install it with{" "}
                <code>npx expo install react-native-svg</code> on Expo, or{" "}
                <code>pnpm add react-native-svg</code> otherwise.
              </p>
              <CodeBlock lang="tsx" code={NATIVE_CODE} />
              <p className={s.note} style={{ marginTop: 14 }}>
                <strong>Requirements:</strong> <code>react-native-svg</code> 14
                or newer, React Native 0.75 or newer (the encoder uses the
                global <code>TextEncoder</code>), and a Metro that resolves
                package <code>exports</code>, which is the default from React
                Native 0.79 and Expo SDK 53. On an older setup, set{" "}
                <code>
                  config.resolver.unstable_enablePackageExports = true
                </code>{" "}
                in <code>metro.config.js</code>.
              </p>
              <p className={s.note}>
                <code>value</code>, <code>size</code>, <code>margin</code>,{" "}
                <code>dotStyle</code>, <code>dotColor</code>,{" "}
                <code>backgroundColor</code>, <code>corner</code> and{" "}
                <code>qr</code> work exactly as in QRCodeProps. Everything else
                an <code>{"<Svg>"}</code> accepts (<code>style</code>,{" "}
                <code>testID</code>, <code>onLayout</code>, …) is passed
                through. There is no <code>className</code>, and{" "}
                <code>idPrefix</code> is not needed.
              </p>
              <PropTable head="Prop" rows={NATIVE_PROPS} marginTop />
              <h3 className={s.apiSubTitle}>NativeLogoOptions</h3>
              <CodeBlock lang="ts" code={NATIVE_LOGO_CODE} />
              <p className={s.note}>
                For a vector logo, pass its markup as <code>svg</code> rather
                than as <code>src</code>. Native cannot measure an image, so a
                logo is square unless you set <code>aspectRatio</code>.
              </p>
              <h3 className={s.apiSubTitle}>Getting an image</h3>
              <CodeBlock lang="tsx" code={NATIVE_IMAGE_CODE} />
              <p className={s.note}>
                <code>{"<QRCode>"}</code> forwards its <code>ref</code> to the{" "}
                <code>Svg</code>, which can rasterise itself. For an SVG string,
                to save an <code>.svg</code> file or render with{" "}
                <code>SvgXml</code>, import <code>toSVGString</code> from{" "}
                <code>@ttsalpha/qrcode/core</code>.
              </p>
              <h3 className={s.apiSubTitle}>Not supported on native</h3>
              <p className={s.note}>
                <code>logo.element</code>: there is no{" "}
                <code>{"<foreignObject>"}</code>, so a warning is logged in
                development and the logo is skipped; use <code>logo.src</code>{" "}
                or <code>logo.svg</code>. The <code>toDataURL(props)</code>{" "}
                helper needs a canvas, so use the <code>ref</code> above.{" "}
                <code>className</code> and web-only <code>{"<svg>"}</code> props
                such as <code>onClick</code> and <code>data-*</code>.
              </p>
            </Group>

            <Group id="core" title="Core">
              <p className={s.note} style={{ marginBottom: 14 }}>
                <code>@ttsalpha/qrcode/core</code> is the part every renderer is
                built on: plain JavaScript with no React and no DOM, so it runs
                on a server, in a worker and in React Native.{" "}
                <code>buildQR(props)</code> returns a <code>QRGeometry</code> in
                a square coordinate space of <code>viewBox</code> units, ready
                to draw with any renderer.
              </p>
              <CodeBlock lang="ts" code={CORE_CODE} />
              <p className={s.note}>
                Draw the background, then <code>modules</code> and{" "}
                <code>finders</code> with <code>clear</code> knocked out of
                them, then <code>logo</code>. The props are those of QRCodeProps
                minus the React-only ones. <code>logo.custom: true</code>{" "}
                reserves the logo area without a <code>src</code>, for a logo
                the renderer draws itself. Invalid input throws a{" "}
                <code>RangeError</code> or <code>TypeError</code>, as in{" "}
                <code>{"<QRCode>"}</code>.
              </p>
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
      <SiteFooter showDocsLink />
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
