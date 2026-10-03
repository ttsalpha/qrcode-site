import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { AUTHOR, breadcrumb, pageMetadata, SITE_URL } from "@/lib/metadata";
import s from "./page.module.css";

const benchmarkDescription =
  "Performance comparison of @ttsalpha/qrcode vs qrcode.react, react-qr-code, qr-code-styling, and qrcode. Covers true cold start, SSR, throughput, repeated-value caching, sequential batch, bundle size, and features.";

export const metadata: Metadata = pageMetadata({
  title: "Benchmark",
  description: benchmarkDescription,
  path: "/benchmark",
});

// ── Bar chart ────────────────────────────────────────────────────────────────

function BarChart({
  rows,
  unit = "ms",
}: {
  rows: { label: string; value: number; winner?: boolean; slow?: boolean }[];
  unit?: string;
}) {
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <div className={s.barChart}>
      {rows.map((r) => (
        <div key={r.label} className={s.barRow}>
          <div className={`${s.barLabel} ${r.winner ? s.barLabelWinner : ""}`}>
            {r.label}
          </div>
          <div className={s.barTrack}>
            <div
              className={`${s.barFill} ${r.winner ? s.barFillWinner : r.slow ? s.barFillSlow : ""}`}
              style={{ width: `${Math.max((r.value / max) * 100, 2)}%` }}
            />
          </div>
          <div className={`${s.barValue} ${r.winner ? s.barValueWinner : ""}`}>
            {unit === "r/s" ? r.value.toLocaleString("en-US") : r.value} {unit}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────

function SectionHead({
  num,
  title,
  desc,
}: {
  num?: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className={s.sectionHead}>
      {num && <span className={s.sectionTag}>{num}</span>}
      <h2 className={s.sectionTitle}>{title}</h2>
      {desc && <p className={s.sectionDesc}>{desc}</p>}
    </div>
  );
}

// ── Cell value renderer ───────────────────────────────────────────────────────
// Values starting with "✕" render the leading char as a styled red cross.

function CellVal({ v }: { v: string }) {
  if (!v.startsWith("✕")) return <>{v}</>;
  const rest = v.slice(1).trim();
  return (
    <>
      <span className={s.cross}>✕</span>
      {rest ? ` ${rest}` : null}
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

const LIBS = [
  "@ttsalpha/qrcode",
  "qrcode.react",
  "qr-code-styling",
  "react-qr-code",
  "qrcode",
] as const;

const benchmarkJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Dataset",
      name: "React QR Code Library Benchmark",
      description: benchmarkDescription,
      url: `${SITE_URL}/benchmark`,
      creator: AUTHOR,
      license: "https://github.com/ttsalpha/qrcode-benchmark",
      variableMeasured: [
        "Throughput (renders/second)",
        "Repeated-value caching",
        "True cold start latency",
        "SSR latency",
        "Sequential batch time",
        "Bundle size",
      ],
    },
    breadcrumb("/benchmark", "Benchmark"),
  ],
};

// ── Data ─────────────────────────────────────────────────────────────────────

type BarRow = {
  label: string;
  value: number;
  winner?: boolean;
  slow?: boolean;
};

const THROUGHPUT_ROWS: BarRow[] = [
  { label: "@ttsalpha/qrcode (toSVGString)", value: 7817, winner: true },
  { label: "qrcode (headless)", value: 4527 },
  { label: "@ttsalpha/qrcode (React)", value: 3950 },
  { label: "qrcode.react (SVG)", value: 1688 },
  { label: "react-qr-code", value: 991 },
  { label: "qr-code-styling (async)", value: 86, slow: true },
];

const REPEATED_ROWS: BarRow[] = [
  { label: "@ttsalpha/qrcode (toSVGString)", value: 129173, winner: true },
  { label: "@ttsalpha/qrcode (React)", value: 12570 },
  { label: "qrcode (headless)", value: 3508 },
  { label: "qrcode.react (SVG)", value: 1311 },
  { label: "react-qr-code", value: 745 },
  { label: "qr-code-styling (async)", value: 63, slow: true },
];

const STYLED_ROWS: BarRow[] = [
  { label: "@ttsalpha/qrcode (toSVGString)", value: 0.251, winner: true },
  { label: "@ttsalpha/qrcode (React)", value: 0.35 },
  { label: "qr-code-styling (async DOM)", value: 11.314, slow: true },
];

type ColdStartRow = {
  lib: string;
  imp: string;
  impP95: string;
  r1: string;
  r1P95: string;
  r2: string;
  win?: boolean;
  slow?: boolean;
};

const COLD_START_ROWS: ColdStartRow[] = [
  {
    lib: "@ttsalpha/qrcode (toSVGString)",
    imp: "3.86 ms",
    impP95: "6.97 ms",
    r1: "5.111 ms",
    r1P95: "5.669 ms",
    r2: "0.94 ms",
    win: true,
  },
  {
    lib: "qrcode (headless)",
    imp: "22.77 ms",
    impP95: "25.18 ms",
    r1: "8.698 ms",
    r1P95: "9.622 ms",
    r2: "1.459 ms",
  },
  {
    lib: "@ttsalpha/qrcode (React)",
    imp: "31.31 ms",
    impP95: "32.07 ms",
    r1: "12.355 ms",
    r1P95: "13.338 ms",
    r2: "1.75 ms",
  },
  {
    lib: "qrcode.react",
    imp: "27.96 ms",
    impP95: "28.23 ms",
    r1: "15.002 ms",
    r1P95: "15.316 ms",
    r2: "4.606 ms",
  },
  {
    lib: "react-qr-code",
    imp: "32.99 ms",
    impP95: "35.74 ms",
    r1: "17.165 ms",
    r1P95: "18.025 ms",
    r2: "9.303 ms",
  },
  {
    lib: "qr-code-styling",
    imp: "4.54 ms",
    impP95: "4.68 ms",
    r1: "58.171 ms",
    r1P95: "62.904 ms",
    r2: "36.346 ms",
    slow: true,
  },
];

type SsrRow = {
  lib: string;
  med: string;
  p95: string;
  p99: string;
  win?: boolean;
};

const SSR_ROWS: SsrRow[] = [
  {
    lib: "@ttsalpha/qrcode (toSVGString)",
    med: "0.445",
    p95: "0.504",
    p99: "0.504",
    win: true,
  },
  { lib: "@ttsalpha/qrcode (React)", med: "1.153", p95: "1.285", p99: "1.285" },
  { lib: "qrcode (headless)", med: "1.8", p95: "1.963", p99: "1.963" },
  { lib: "qrcode.react", med: "2.604", p95: "2.849", p99: "2.849" },
  { lib: "react-qr-code", med: "3.257", p95: "4.239", p99: "4.239" },
  { lib: "qr-code-styling", med: "✕ Not SSR-safe", p95: "—", p99: "—" },
];

type BatchRow = {
  lib: string;
  batch: string;
  med: string;
  p95: string;
  avg: string;
  win?: boolean;
  slow?: boolean;
};

const BATCH_ROWS: BatchRow[] = [
  {
    lib: "@ttsalpha/qrcode (toSVGString)",
    batch: "100",
    med: "32.65",
    p95: "32.93",
    avg: "0.326",
    win: true,
  },
  {
    lib: "@ttsalpha/qrcode (React)",
    batch: "100",
    med: "50.25",
    p95: "99.07",
    avg: "0.502",
  },
  {
    lib: "qrcode (headless)",
    batch: "100",
    med: "69.82",
    p95: "73.77",
    avg: "0.698",
  },
  {
    lib: "qrcode.react",
    batch: "100",
    med: "147.69",
    p95: "151.89",
    avg: "1.477",
  },
  {
    lib: "react-qr-code",
    batch: "100",
    med: "240.15",
    p95: "253.51",
    avg: "2.401",
  },
  {
    lib: "qr-code-styling",
    batch: "20",
    med: "548.67",
    p95: "572.22",
    avg: "27.433",
    slow: true,
  },
];

type DataComplexityRow = { type: string; vals: string[]; win: number };

const DATA_COMPLEXITY_ROWS: DataComplexityRow[] = [
  {
    type: "Short URL",
    vals: ["0.122 ms", "0.207 ms", "0.624 ms", "1.013 ms", "0.195 ms"],
    win: 0,
  },
  {
    type: "Numeric (20 digits)",
    vals: ["0.081 ms", "0.191 ms", "0.455 ms", "0.942 ms", "0.123 ms"],
    win: 0,
  },
  {
    type: "AlphaNumeric",
    vals: ["0.124 ms", "0.727 ms", "0.63 ms", "1.015 ms", "0.19 ms"],
    win: 0,
  },
  {
    type: "Unicode (Japanese)",
    vals: ["0.172 ms", "0.268 ms", "0.799 ms", "1.346 ms", "0.321 ms"],
    win: 0,
  },
  {
    type: "Long URL (120 chars)",
    vals: ["0.443 ms", "0.541 ms", "1.725 ms", "3.044 ms", "0.785 ms"],
    win: 0,
  },
  {
    type: "vCard",
    vals: ["0.371 ms", "0.469 ms", "1.472 ms", "2.555 ms", "0.601 ms"],
    win: 0,
  },
];

type MemoryRow = {
  lib: string;
  base: string;
  peak: string;
  fin: string;
  drift: string;
  win?: boolean;
};

const MEMORY_ROWS: MemoryRow[] = [
  {
    lib: "@ttsalpha/qrcode (toSVGString)",
    base: "42.15 MB",
    peak: "42.15 MB",
    fin: "42.1 MB",
    drift: "0 MB",
    win: true,
  },
  {
    lib: "@ttsalpha/qrcode (React)",
    base: "42.18 MB",
    peak: "42.25 MB",
    fin: "42.2 MB",
    drift: "−0.01 MB",
  },
  {
    lib: "react-qr-code",
    base: "42.16 MB",
    peak: "42.24 MB",
    fin: "42.14 MB",
    drift: "−0.01 MB",
  },
  {
    lib: "qrcode.react",
    base: "42.11 MB",
    peak: "42.34 MB",
    fin: "42.15 MB",
    drift: "+0.02 MB",
  },
  {
    lib: "qrcode (headless)",
    base: "42.18 MB",
    peak: "42.33 MB",
    fin: "42.2 MB",
    drift: "+0.02 MB",
  },
];

type BundleRow = {
  lib: string;
  min: string;
  gz: string;
  deps: string;
  winGz?: boolean;
};

const BUNDLE_ROWS: BundleRow[] = [
  { lib: "qrcode.react", min: "15.9", gz: "5.9", deps: "0", winGz: true },
  { lib: "react-qr-code", min: "22.8", gz: "8.3", deps: "2 (bundled)" },
  { lib: "qrcode", min: "22.9", gz: "8.5", deps: "3 (bundled)" },
  { lib: "@ttsalpha/qrcode", min: "25.1", gz: "10.8", deps: "0" },
  { lib: "qr-code-styling", min: "45.8", gz: "13.5", deps: "1 (bundled)" },
];

type FeatureComparisonRow = { feature: string; vals: string[]; wins: number[] };

const FEATURE_COMPARISON: FeatureComparisonRow[] = [
  {
    feature: "Output formats",
    vals: [
      "SVG · PNG",
      "SVG · Canvas",
      "SVG · Canvas · PNG",
      "SVG only",
      "SVG · Canvas · PNG",
    ],
    wins: [],
  },
  {
    feature: "React component",
    vals: ["✓", "✓", "—", "✓", "—"],
    wins: [0, 1, 3],
  },
  {
    feature: "React Native / Expo",
    vals: ["✓ ./native", "✕", "✕", "✓", "✓ string only"],
    wins: [0, 3],
  },
  {
    feature: "Logo support",
    vals: ["URL + React node", "URL", "URL", "—", "—"],
    wins: [0],
  },
  {
    feature: "Auto ECL for logo",
    vals: ["✓ auto", "manual only", "manual only", "—", "—"],
    wins: [0],
  },
  {
    feature: "Custom dot & corner styles",
    vals: ["✓", "—", "✓", "—", "—"],
    wins: [0, 2],
  },
  {
    feature: "Standalone string API",
    vals: ["✓ sync", "—", "—", "—", "✓ async"],
    wins: [0],
  },
  {
    feature: "SSR / Edge runtime",
    vals: ["✓", "✓", "✕ browser only", "✓", "✓"],
    wins: [0, 1, 3, 4],
  },
  {
    feature: "Error correction level",
    vals: ["✓", "✓", "✓", "✓", "✓"],
    wins: [0, 1, 2, 3, 4],
  },
  {
    feature: "QR version control",
    vals: ["✓", "✓", "✓", "—", "✓"],
    wins: [0, 1, 2, 4],
  },
  {
    feature: "Zero dependencies",
    vals: ["✓ (0)", "✓ (0)", "✕ (1 dep)", "✕ (2 deps)", "✕ (3 deps)"],
    wins: [0, 1],
  },
  {
    feature: "TypeScript built-in",
    vals: ["✓", "✓", "✓", "✓", "✕ via @types"],
    wins: [0, 1, 2, 3],
  },
  {
    feature: "ESM + CJS dual export",
    vals: ["✓", "✓", "✕", "✓", "✕ CJS only"],
    wins: [0, 1, 3],
  },
  {
    feature: "Accessibility (aria / title)",
    vals: ["✓", "✓", "—", "✓", "—"],
    wins: [0, 1, 3],
  },
  {
    feature: "Bundle size (gzip)",
    vals: ["10.8 KB", "5.9 KB", "13.5 KB", "8.3 KB", "8.5 KB"],
    wins: [1],
  },
];

type FeatureRow = [string, boolean, boolean, boolean | null, boolean, boolean];

const FEATURES: FeatureRow[] = [
  ["SVG output", true, true, true, true, true],
  ["Canvas output", false, true, true, false, true],
  ["PNG export", true, false, true, false, true],
  ["toSVGString() — sync, no DOM", true, false, false, false, false],
  ["React component", true, true, false, true, false],
  ["React Native / Expo", true, false, false, true, true],
  ["SSR / Edge runtime safe", true, true, null, true, true],
  ["Zero dependencies", true, true, false, false, false],
  ["Dot shape styles", true, false, true, false, false],
  ["Corner styles", true, false, true, false, false],
  ["Logo — image URL", true, true, true, false, false],
  ["Logo — any React node", true, false, false, false, false],
  ["Error correction level", true, true, true, true, true],
  ["QR version control", true, true, true, false, true],
  ["TypeScript built-in", true, true, true, true, false],
  ["ESM + CJS dual export", true, true, false, true, false],
  ["Accessibility (aria / title)", true, true, false, true, false],
  ["React 18+ support", true, true, true, true, true],
  ["React 16 / 17 support", false, true, true, true, true],
];

const FEATURE_SCORES = FEATURES.reduce<number[]>(
  (acc, row) => acc.map((n, i) => n + (row[i + 1] === true ? 1 : 0)),
  LIBS.map(() => 0),
);
const FEATURE_BEST = Math.max(...FEATURE_SCORES);

type SummaryRow = { cat: string; vals: string[]; win: number };

const SUMMARY_ROWS: SummaryRow[] = [
  { cat: "Throughput", vals: ["#1", "#3", "✕", "#4", "#2"], win: 0 },
  { cat: "Repeated value", vals: ["#1", "#3", "✕", "#4", "#2"], win: 0 },
  { cat: "True cold start", vals: ["#1", "#3", "✕", "#4", "#2"], win: 0 },
  { cat: "SSR latency", vals: ["#1", "#3", "✕", "#4", "#2"], win: 0 },
  { cat: "Sequential batch", vals: ["#1", "#3", "✕", "#4", "#2"], win: 0 },
  { cat: "Styled QR", vals: ["#1", "—", "#2", "—", "—"], win: 0 },
  { cat: "Bundle size", vals: ["#4", "#1", "#5", "#2", "#3"], win: 1 },
  { cat: "Feature score", vals: ["#1", "#2", "#3", "#4", "#5"], win: 0 },
];

export default function BenchmarkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(benchmarkJsonLd) }}
      />
      <SiteNav />

      <main>
        {/* Hero */}
        <section className={s.hero}>
          <div className={s.wrap}>
            <span className={s.heroTag}>Performance</span>
            <h1 className={s.heroTitle}>Benchmark</h1>
            <p className={s.heroSub}>
              I benchmarked{" "}
              <a
                href="https://www.npmjs.com/package/@ttsalpha/qrcode"
                target="_blank"
                rel="noopener noreferrer"
                className={s.heroSubLink}
              >
                <code>@ttsalpha/qrcode</code>
              </a>{" "}
              against the three QR libraries most React apps use:{" "}
              <a
                href="https://www.npmjs.com/package/qrcode.react"
                target="_blank"
                rel="noopener noreferrer"
                className={s.heroSubLink}
              >
                qrcode.react
              </a>
              ,{" "}
              <a
                href="https://www.npmjs.com/package/react-qr-code"
                target="_blank"
                rel="noopener noreferrer"
                className={s.heroSubLink}
              >
                react-qr-code
              </a>
              , and{" "}
              <a
                href="https://www.npmjs.com/package/qr-code-styling"
                target="_blank"
                rel="noopener noreferrer"
                className={s.heroSubLink}
              >
                qr-code-styling
              </a>
              . I also included{" "}
              <a
                href="https://www.npmjs.com/package/qrcode"
                target="_blank"
                rel="noopener noreferrer"
                className={s.heroSubLink}
              >
                qrcode
              </a>
              , the most-downloaded QR package on npm, as a headless baseline.
              The tests cover true cold start, SSR latency, throughput,
              repeated-value caching, sequential batch, bundle size, and feature
              completeness.
            </p>
            <p className={s.heroBadges}>
              Environment: ubuntu-24.04 · Node.js v24.21.0 · ECL pinned to M ·
              median of 3 runs · Oct 2026
            </p>
            <p className={s.heroSource}>
              Source:{" "}
              <a
                href="https://github.com/ttsalpha/qrcode-benchmark"
                target="_blank"
                rel="noopener noreferrer"
                className={s.heroSourceLink}
              >
                github.com/ttsalpha/qrcode-benchmark
              </a>
            </p>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className={`${s.section} ${s.sectionAlt}`}>
          <div className={s.wrap}>
            <SectionHead
              title="Feature Comparison"
              desc="Key capabilities across all five libraries, before we get to the numbers."
            />
            <div className={s.tableWrap}>
              <table className={`${s.table} ${s.tableWrapCells}`}>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th className={s.center}>@ttsalpha/qrcode</th>
                    <th className={s.center}>qrcode.react</th>
                    <th className={s.center}>qr-code-styling</th>
                    <th className={s.center}>react-qr-code</th>
                    <th className={s.center}>qrcode</th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURE_COMPARISON.map(({ feature, vals, wins }) => (
                    <tr key={feature}>
                      <td>{feature}</td>
                      {vals.map((v, i) => (
                        <td
                          key={LIBS[i]}
                          className={`${s.center} ${
                            v.startsWith("✕")
                              ? s.cellNo
                              : wins.includes(i)
                                ? s.cellWin
                                : v === "—"
                                  ? s.cellDim
                                  : ""
                          }`}
                        >
                          <CellVal v={v} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 1. Throughput */}
        <section className={s.section}>
          <div className={s.wrap}>
            <SectionHead
              num="01 — Throughput"
              title="Unique input per render, 3 s window"
              desc="Each call receives a distinct URL, so no lib can benefit from caching. Higher r/s is better."
            />
            <BarChart unit="r/s" rows={THROUGHPUT_ROWS} />
            <p className={s.note}>
              <code>toSVGString</code> reaches <strong>7,817 r/s</strong>: 4.6×
              qrcode.react, 1.7× the headless qrcode baseline, 91×
              qr-code-styling. It runs synchronously with no React and no DOM,
              which suits server-side and batch work. The React component path,
              at 3,950 r/s, is 2.3× qrcode.react and 4.0× react-qr-code; against
              the headless baseline <code>toSVGString</code> is the
              like-for-like entry, since that path never pays for React.
            </p>
          </div>
        </section>

        {/* 2. Repeated Value */}
        <section className={`${s.section} ${s.sectionAlt}`}>
          <div className={s.wrap}>
            <SectionHead
              num="02 — Repeated Value"
              title="Same input every render"
              desc="Re-rendering one QR across requests or mounts, like receipts, kiosk screens, and shared links. @ttsalpha/qrcode ≥2.4 memoizes matrices in a 16-entry LRU, so this test is expected to favor it by design; it is kept separate from the cold-path tests above."
            />
            <BarChart unit="r/s" rows={REPEATED_ROWS} />
            <p className={s.note}>
              With both the matrix and the path cache hitting,{" "}
              <code>toSVGString</code> reaches <strong>129,173 r/s</strong>,
              about 37× the headless qrcode baseline and 99× qrcode.react. No
              other library caches by value. This payload is also slightly
              longer than test 01&apos;s, so their numbers sit a notch below
              their cold-path throughput.
            </p>
          </div>
        </section>

        {/* 3. True Cold Start */}
        <section className={s.section}>
          <div className={s.wrap}>
            <SectionHead
              num="03 — True Cold Start"
              title="Fresh process per round via child_process.fork"
              desc="10 rounds each. Measures real Lambda / edge cold-start: import + first render with zero JIT warmup."
            />
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Library</th>
                    <th>Import (ms)</th>
                    <th>Import p95</th>
                    <th>1st render</th>
                    <th>1st p95</th>
                    <th>2nd render</th>
                  </tr>
                </thead>
                <tbody>
                  {COLD_START_ROWS.map(
                    ({ lib, imp, impP95, r1, r1P95, r2, win, slow }) => (
                      <tr key={lib}>
                        <td>{lib}</td>
                        <td>{imp}</td>
                        <td>{impP95}</td>
                        <td className={win ? s.cellWin : slow ? s.cellNo : ""}>
                          {r1}
                        </td>
                        <td className={win ? s.cellWin : slow ? s.cellNo : ""}>
                          {r1P95}
                        </td>
                        <td>{r2}</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
            <p className={s.note}>
              <code>toSVGString</code> first-renders in{" "}
              <strong>5.111 ms</strong>, 1.7× faster than the headless qrcode
              baseline (8.698 ms) and 2.9× faster than qrcode.react (15.002 ms).
              Its import is the lightest here at 3.86 ms, loaded from the{" "}
              <code>./core</code> entry, which pulls in no React. The component
              path imports React and <code>react-dom/server</code> instead: 31.3
              ms. qr-code-styling imports in 4.54 ms but first-renders in 58.2
              ms, and is still at 36.3 ms on the second.
            </p>
          </div>
        </section>

        {/* 4. SSR Simulation */}
        <section className={`${s.section} ${s.sectionAlt}`}>
          <div className={s.wrap}>
            <SectionHead
              num="04 — SSR Simulation"
              title="Real-world payloads"
              desc="12 varied payloads (short URL, long URL, vCard, numeric, WiFi, mailto, tel…), 10 rounds, p99 included."
            />
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Library</th>
                    <th>Median (ms)</th>
                    <th>p95 (ms)</th>
                    <th>p99 (ms)</th>
                  </tr>
                </thead>
                <tbody>
                  {SSR_ROWS.map(({ lib, med, p95, p99, win }) => (
                    <tr key={lib}>
                      <td className={win ? s.cellWin : ""}>{lib}</td>
                      <td
                        className={
                          win ? s.cellWin : med.startsWith("✕") ? s.cellNo : ""
                        }
                      >
                        <CellVal v={med} />
                      </td>
                      <td className={win ? s.cellWin : ""}>{p95}</td>
                      <td>{p99}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={s.note}>
              <code>toSVGString</code> is{" "}
              <strong>4.0× faster than the headless qrcode baseline</strong> and
              5.9× faster than qrcode.react across 12 mixed payloads. Tight p99
              (0.504 ms) means latency stays predictable even with complex
              inputs like vCard or WiFi configs.
            </p>
          </div>
        </section>

        {/* 5. Sequential Batch */}
        <section className={s.section}>
          <div className={s.wrap}>
            <SectionHead
              num="05 — Sequential Batch"
              title="Burst of N renders, single thread"
              desc="Node.js is single-threaded, so React renders run sequentially. Batch=100 (qr-code-styling: 20). 20 rounds (qr-code-styling: 10)."
            />
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Library</th>
                    <th>Batch</th>
                    <th>Median batch (ms)</th>
                    <th>p95 batch (ms)</th>
                    <th>Avg per render (ms)</th>
                  </tr>
                </thead>
                <tbody>
                  {BATCH_ROWS.map(
                    ({ lib, batch, med, p95, avg, win, slow }) => (
                      <tr key={lib}>
                        <td className={slow ? s.cellNo : ""}>{lib}</td>
                        <td>{batch}</td>
                        <td className={win ? s.cellWin : slow ? s.cellNo : ""}>
                          {med}
                        </td>
                        <td className={win ? s.cellWin : slow ? s.cellNo : ""}>
                          {p95}
                        </td>
                        <td className={win ? s.cellWin : slow ? s.cellNo : ""}>
                          {avg}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
            <p className={s.note}>
              <code>toSVGString</code> completes 100 renders in{" "}
              <strong>32.65 ms median</strong>, or 0.326 ms per render. That is
              2.1× faster than the headless qrcode baseline and 4.5× faster than
              qrcode.react. qr-code-styling takes 549 ms for just 20 renders; at
              that rate, 100 renders would take about 2,743 ms.
            </p>
          </div>
        </section>

        {/* 6. Styled QR */}
        <section className={`${s.section} ${s.sectionAlt}`}>
          <div className={s.wrap}>
            <SectionHead
              num="06 — Styled QR"
              title="Custom dot shapes + corner styles"
              desc="ECL=H (logo-safe), size=512 px. Only @ttsalpha/qrcode and qr-code-styling support custom styling."
            />
            <BarChart rows={STYLED_ROWS} />
            <p className={s.note}>
              @ttsalpha/qrcode renders styled QR codes{" "}
              <strong>45× faster than qr-code-styling</strong>, and it stays
              SSR-safe, sync, and DOM-free while doing it. qr-code-styling needs
              a browser environment (a JSDOM polyfill on Node.js/Edge) with an
              async API that does not scale.
              <br />
              <br />
              qrcode.react, react-qr-code, and qrcode have no styling API.
            </p>
          </div>
        </section>

        {/* 7. Data Complexity */}
        <section className={s.section}>
          <div className={s.wrap}>
            <SectionHead
              num="07 — Data Complexity"
              title="Per-type render time"
              desc="500 samples each, unique input. Median per render, lower is better."
            />
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Data type</th>
                    <th>@ttsalpha util</th>
                    <th>@ttsalpha React</th>
                    <th>qrcode.react</th>
                    <th>react-qr-code</th>
                    <th>qrcode</th>
                  </tr>
                </thead>
                <tbody>
                  {DATA_COMPLEXITY_ROWS.map(({ type, vals, win }) => (
                    <tr key={type}>
                      <td>{type}</td>
                      {vals.map((v, i) => (
                        <td
                          key={LIBS[i]}
                          className={win === i ? s.cellWin : ""}
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={s.note}>
              <code>toSVGString</code> wins on all 6 data types, and beats
              headless qrcode on each of them. The @ttsalpha React path is ahead
              of both React libraries on five of the six; alphanumeric is the
              exception, in both runs measured on this image. Headless qrcode is
              the fastest of the rest, ahead of qrcode.react and react-qr-code
              everywhere.
            </p>
          </div>
        </section>

        {/* 8. Memory */}
        <section className={`${s.section} ${s.sectionAlt}`}>
          <div className={s.wrap}>
            <SectionHead
              num="08 — Memory Stability"
              title="5,000 renders, unique input"
              desc="Heap sampled at baseline, peak, and final. Near-zero drift across all libraries."
            />
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Library</th>
                    <th>Baseline</th>
                    <th>Peak</th>
                    <th>Final</th>
                    <th>Drift</th>
                  </tr>
                </thead>
                <tbody>
                  {MEMORY_ROWS.map(({ lib, base, peak, fin, drift, win }) => (
                    <tr key={lib}>
                      <td>{lib}</td>
                      <td>{base}</td>
                      <td className={win ? s.cellWin : ""}>{peak}</td>
                      <td>{fin}</td>
                      <td>{drift}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={s.note}>
              Peak stays within 0.25 MB of baseline across 5,000 renders with
              unique inputs, and nothing drifts in a way that compounds.
              @ttsalpha/qrcode&apos;s 16-entry matrix cache holds steady: the{" "}
              <code>toSVGString</code> path drifts 0 MB, the React path −0.01
              MB.
            </p>
          </div>
        </section>

        {/* 9. Bundle Size */}
        <section className={s.section}>
          <div className={s.wrap}>
            <SectionHead
              num="09 — Bundle Size"
              title="Minified + gzip, dependencies bundled"
              desc="Source: bundlephobia.com. Minified + gzip, react/react-dom external, each lib's own dependencies bundled."
            />
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Library</th>
                    <th>Min (KB)</th>
                    <th>Gzip (KB)</th>
                    <th>Runtime deps</th>
                  </tr>
                </thead>
                <tbody>
                  {BUNDLE_ROWS.map(({ lib, min, gz, deps, winGz }) => (
                    <tr key={lib}>
                      <td>{lib}</td>
                      <td>{min}</td>
                      <td className={winGz ? s.cellWin : ""}>{gz}</td>
                      <td>{deps}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={s.note}>
              qrcode.react stays the smallest at 5.9 KB gzip; @ttsalpha/qrcode
              is the largest of the four with a plain SVG pipeline, at 10.8 KB.
              It carries zero runtime dependencies and is tree-shakeable (
              <code>sideEffects: false</code>), so importing only the component,
              or only <code>toSVGString</code>, costs less than the figure
              above.
            </p>
          </div>
        </section>

        {/* 10. Feature Comparison */}
        <section className={`${s.section} ${s.sectionAlt}`}>
          <div className={s.wrap}>
            <SectionHead num="10 — Features" title="Capability comparison" />
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th className={s.center}>@ttsalpha/qrcode</th>
                    <th className={s.center}>qrcode.react</th>
                    <th className={s.center}>qr-code-styling</th>
                    <th className={s.center}>react-qr-code</th>
                    <th className={s.center}>qrcode</th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURES.map(([feature, a, b, c, d, e]) => (
                    <tr key={feature}>
                      <td>{feature}</td>
                      {[a, b, c, d, e].map((v, i) => (
                        <td key={LIBS[i]} className={s.center}>
                          {v === true ? (
                            <span className={s.check}>✓</span>
                          ) : v === false ? (
                            <span className={s.dash}>—</span>
                          ) : (
                            <span className={s.cross}>✕</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className={s.scoreRow}>
                    <td>Score</td>
                    {FEATURE_SCORES.map((n, i) => (
                      <td
                        key={LIBS[i]}
                        className={`${s.center} ${n === FEATURE_BEST ? s.cellWin : ""}`}
                      >
                        {n} / {FEATURES.length}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 11. Summary */}
        <section className={s.section}>
          <div className={s.wrap}>
            <SectionHead num="11 — Summary" title="Rankings" />
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th className={s.center}>@ttsalpha/qrcode</th>
                    <th className={s.center}>qrcode.react</th>
                    <th className={s.center}>qr-code-styling</th>
                    <th className={s.center}>react-qr-code</th>
                    <th className={s.center}>qrcode</th>
                  </tr>
                </thead>
                <tbody>
                  {SUMMARY_ROWS.map(({ cat, vals, win }) => (
                    <tr key={cat}>
                      <td>{cat}</td>
                      {vals.map((v, i) => (
                        <td
                          key={LIBS[i]}
                          className={`${s.center} ${v === "✕" ? s.cellNo : win === i ? s.cellWin : v === "—" ? s.cellDim : ""}`}
                        >
                          <CellVal v={v} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Reproduce */}
        <section className={`${s.section} ${s.sectionAlt}`}>
          <div className={s.wrap}>
            <SectionHead
              title="Reproduce"
              desc="All benchmark scripts are open source. Clone and run locally."
            />
            <div className={s.reproduceGrid}>
              <div className={s.reproduceCard}>
                <div className={s.reproduceLabel}>Repository</div>
                <a
                  href="https://github.com/ttsalpha/qrcode-benchmark"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.reproduceLink}
                >
                  github.com/ttsalpha/qrcode-benchmark
                </a>
              </div>
              <div className={s.reproduceCard}>
                <div className={s.reproduceLabel}>Main benchmark</div>
                <code className={s.reproduceCode}>
                  pnpm bench
                  <span className={s.reproduceComment}>
                    {" "}
                    # node --expose-gc benchmark.mjs
                  </span>
                </code>
              </div>
              <div className={s.reproduceCard}>
                <div className={s.reproduceLabel}>Cold start benchmark</div>
                <code className={s.reproduceCode}>
                  node benchmark-coldstart.mjs
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* When to Choose */}
        <section className={s.section}>
          <div className={s.wrap}>
            <SectionHead title="When to Choose" />
            <div className={s.chooseGrid}>
              <div className={s.chooseCard}>
                <div
                  className={`${s.chooseCardTitle} ${s.chooseCardTitleWinner}`}
                >
                  <a
                    href="https://www.npmjs.com/package/@ttsalpha/qrcode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={s.chooseCardTitleLink}
                  >
                    @ttsalpha/qrcode
                  </a>
                </div>
                <ul className={s.chooseList}>
                  <li>
                    Styled QR that has to survive SSR, the only library here
                    with both
                  </li>
                  <li>
                    Fastest cold start, 2.9× qrcode.react, and 4.6× its
                    throughput
                  </li>
                  <li>
                    <code>toSVGString</code> for email or batch jobs, with no
                    React and no DOM
                  </li>

                  <li>Need the same component on React Native and Expo</li>
                  <li>Logo as any React node</li>
                  <li>
                    The same QR re-rendered often, where the cache pays off
                  </li>
                </ul>
              </div>
              <div className={s.chooseCard}>
                <div className={s.chooseCardTitle}>
                  <a
                    href="https://www.npmjs.com/package/qrcode.react"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={s.chooseCardTitleLink}
                  >
                    qrcode.react
                  </a>
                </div>
                <ul className={s.chooseList}>
                  <li>Bundle size is the primary constraint (5.9 KB gzip)</li>
                  <li>Targeting React 16/17 legacy projects</li>
                  <li>Need Canvas output alongside SVG</li>
                  <li>Simplest possible API is sufficient</li>
                </ul>
              </div>
              <div className={s.chooseCard}>
                <div className={s.chooseCardTitle}>
                  <a
                    href="https://www.npmjs.com/package/qr-code-styling"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={s.chooseCardTitleLink}
                  >
                    qr-code-styling
                  </a>
                </div>
                <ul className={s.chooseList}>
                  <li>Need Canvas output or PNG export in the browser</li>
                  <li>Browser-only, no SSR requirement</li>
                  <li>Willing to accept ~45× slower styled render times</li>
                </ul>
              </div>
              <div className={s.chooseCard}>
                <div className={s.chooseCardTitle}>
                  <a
                    href="https://www.npmjs.com/package/react-qr-code"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={s.chooseCardTitleLink}
                  >
                    react-qr-code
                  </a>
                </div>
                <ul className={s.chooseList}>
                  <li>Plain QR codes only, with no styling or logo</li>
                  <li>
                    Fewest features and slowest renders among the SSR-safe React
                    libraries
                  </li>
                </ul>
              </div>
              <div className={s.chooseCard}>
                <div className={s.chooseCardTitle}>
                  <a
                    href="https://www.npmjs.com/package/qrcode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={s.chooseCardTitleLink}
                  >
                    qrcode
                  </a>
                </div>
                <ul className={s.chooseList}>
                  <li>Headless Node.js pipelines with no React at all</li>
                  <li>Need terminal / PNG-file output on the server</li>
                  <li>Async-only API and no styling, so plain QR codes only</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter showDocsLink />
    </>
  );
}
