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
  { label: "@ttsalpha/qrcode (toSVGString)", value: 14259, winner: true },
  { label: "@ttsalpha/qrcode (React)", value: 8238 },
  { label: "qrcode (headless)", value: 8174 },
  { label: "qrcode.react (SVG)", value: 3203 },
  { label: "react-qr-code", value: 2106 },
  { label: "qr-code-styling (async)", value: 137, slow: true },
];

const REPEATED_ROWS: BarRow[] = [
  { label: "@ttsalpha/qrcode (toSVGString)", value: 256856, winner: true },
  { label: "@ttsalpha/qrcode (React)", value: 24319 },
  { label: "qrcode (headless)", value: 7518 },
  { label: "qrcode.react (SVG)", value: 2806 },
  { label: "react-qr-code", value: 1565 },
  { label: "qr-code-styling (async)", value: 99, slow: true },
];

const STYLED_ROWS: BarRow[] = [
  { label: "@ttsalpha/qrcode (toSVGString)", value: 0.136, winner: true },
  // biome-ignore lint/suspicious/noApproximativeNumericConstant: measured ms, not Math.LOG10E
  { label: "@ttsalpha/qrcode (React)", value: 0.434 },
  { label: "qr-code-styling (async DOM)", value: 7.104, slow: true },
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
    imp: "5.15 ms",
    impP95: "8.17 ms",
    r1: "2.575 ms",
    r1P95: "3.006 ms",
    r2: "0.973 ms",
    win: true,
  },
  {
    lib: "qrcode (headless)",
    imp: "12.59 ms",
    impP95: "15.71 ms",
    r1: "4.938 ms",
    r1P95: "5.698 ms",
    r2: "1.196 ms",
  },
  {
    lib: "@ttsalpha/qrcode (React)",
    imp: "18.52 ms",
    impP95: "20.06 ms",
    r1: "6.869 ms",
    r1P95: "7.495 ms",
    r2: "1.144 ms",
  },
  {
    lib: "qrcode.react",
    imp: "17.36 ms",
    impP95: "20.45 ms",
    r1: "8.659 ms",
    r1P95: "8.864 ms",
    r2: "2.869 ms",
  },
  {
    lib: "react-qr-code",
    imp: "19.81 ms",
    impP95: "23.25 ms",
    r1: "9.84 ms",
    r1P95: "11.364 ms",
    r2: "6.365 ms",
  },
  {
    lib: "qr-code-styling",
    imp: "2.99 ms",
    impP95: "3.12 ms",
    r1: "34.796 ms",
    r1P95: "36.983 ms",
    r2: "21.614 ms",
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
    med: "0.297",
    p95: "0.309",
    p99: "0.309",
    win: true,
  },
  { lib: "@ttsalpha/qrcode (React)", med: "0.731", p95: "0.842", p99: "0.842" },
  { lib: "qrcode (headless)", med: "1.038", p95: "1.09", p99: "1.09" },
  { lib: "qrcode.react", med: "1.466", p95: "1.753", p99: "1.753" },
  { lib: "react-qr-code", med: "1.885", p95: "2.472", p99: "2.472" },
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
    med: "20.22",
    p95: "20.58",
    avg: "0.202",
    win: true,
  },
  {
    lib: "qrcode (headless)",
    batch: "100",
    med: "42.42",
    p95: "45.4",
    avg: "0.424",
  },
  {
    lib: "@ttsalpha/qrcode (React)",
    batch: "100",
    med: "45.48",
    p95: "60.22",
    avg: "0.455",
  },
  {
    lib: "qrcode.react",
    batch: "100",
    med: "89.76",
    p95: "92.85",
    avg: "0.898",
  },
  {
    lib: "react-qr-code",
    batch: "100",
    med: "133.33",
    p95: "138.18",
    avg: "1.333",
  },
  {
    lib: "qr-code-styling",
    batch: "20",
    med: "346.62",
    p95: "366.64",
    avg: "17.331",
    slow: true,
  },
];

type DataComplexityRow = { type: string; vals: string[]; win: number };

const DATA_COMPLEXITY_ROWS: DataComplexityRow[] = [
  {
    type: "Short URL",
    vals: ["0.069 ms", "0.281 ms", "0.321 ms", "0.512 ms", "0.133 ms"],
    win: 0,
  },
  {
    type: "Numeric (20 digits)",
    vals: ["0.044 ms", "0.083 ms", "0.245 ms", "0.503 ms", "0.069 ms"],
    win: 0,
  },
  {
    type: "AlphaNumeric",
    vals: ["0.067 ms", "0.105 ms", "0.346 ms", "0.472 ms", "0.125 ms"],
    win: 0,
  },
  {
    type: "Unicode (Japanese)",
    vals: ["0.093 ms", "0.128 ms", "0.46 ms", "0.703 ms", "0.154 ms"],
    win: 0,
  },
  {
    type: "Long URL (120 chars)",
    vals: ["0.217 ms", "0.276 ms", "1.032 ms", "1.693 ms", "0.374 ms"],
    win: 0,
  },
  {
    type: "vCard",
    vals: ["0.184 ms", "0.225 ms", "0.854 ms", "1.429 ms", "0.353 ms"],
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
    base: "41 MB",
    peak: "41.05 MB",
    fin: "41.03 MB",
    drift: "+0.02 MB",
    win: true,
  },
  {
    lib: "@ttsalpha/qrcode (React)",
    base: "40.99 MB",
    peak: "41.13 MB",
    fin: "41.05 MB",
    drift: "+0.07 MB",
  },
  {
    lib: "react-qr-code",
    base: "41.04 MB",
    peak: "41.15 MB",
    fin: "41.05 MB",
    drift: "0 MB",
  },
  {
    lib: "qrcode.react",
    base: "41.06 MB",
    peak: "41.21 MB",
    fin: "41.02 MB",
    drift: "−0.04 MB",
  },
  {
    lib: "qrcode (headless)",
    base: "41.1 MB",
    peak: "41.23 MB",
    fin: "41.06 MB",
    drift: "−0.04 MB",
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
  { lib: "@ttsalpha/qrcode", min: "24.5", gz: "10.7", deps: "0" },
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
    vals: ["10.7 KB", "5.9 KB", "13.5 KB", "8.3 KB", "8.5 KB"],
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

type SummaryRow = { cat: string; vals: string[]; win: number };

const SUMMARY_ROWS: SummaryRow[] = [
  { cat: "Throughput", vals: ["#1", "#3", "✕", "#4", "#2"], win: 0 },
  { cat: "Repeated value", vals: ["#1", "#3", "✕", "#4", "#2"], win: 0 },
  { cat: "True cold start", vals: ["#1", "#3", "✕", "#4", "#2"], win: 0 },
  { cat: "SSR latency", vals: ["#1", "#3", "✕", "#4", "#2"], win: 0 },
  { cat: "Sequential batch", vals: ["#1", "#3", "✕", "#4", "#2"], win: 0 },
  { cat: "Styled QR", vals: ["#1", "—", "#2", "—", "—"], win: 0 },
  { cat: "Bundle size", vals: ["#2", "#1", "#5", "#3", "#4"], win: 1 },
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
              Environment: ubuntu-latest · Node.js v24.21.0 · ECL pinned to M ·
              median of 3 runs · Sep 2026
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
              <code>toSVGString</code> reaches <strong>14,259 r/s</strong>,
              which is 4.5× faster than qrcode.react and 104× faster than
              qr-code-styling. The React component path, at 8,238 r/s, outruns
              every other React library and now edges past the headless qrcode
              baseline. It runs synchronously with no React or DOM overhead, so
              it fits server-side and batch workloads well.
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
              <code>toSVGString</code> reaches <strong>256,856 r/s</strong>,
              about 34× the headless qrcode baseline and 92× qrcode.react. No
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
              <strong>2.575 ms</strong>, 1.9× faster than the headless qrcode
              baseline (4.938 ms) and 3.4× faster than qrcode.react (8.659 ms).
              It also has the lightest import of any full pipeline at 5.15 ms:
              3.0.0 dropped <code>react-dom/server</code>, so the string path
              loads React alone. Rendering the component for SSR still pulls in{" "}
              <code>react-dom/server</code>, which imports in 18.52 ms.
              qr-code-styling imports fastest at 2.99 ms yet first-renders in
              34.8 ms and stays slow at 21.6 ms, because its DOM-based async
              pipeline does not JIT-warm effectively.
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
              <strong>3.5× faster than the headless qrcode baseline</strong> and
              4.9× faster than qrcode.react across 12 mixed payloads. Tight p99
              (0.309 ms) means latency stays predictable even with complex
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
              <strong>20.22 ms median</strong>, or 0.202 ms per render. That is
              2.1× faster than the headless qrcode baseline and 4.4× faster than
              qrcode.react. qr-code-styling takes 347 ms for just 20 renders; at
              that rate, 100 renders would take about 1,733 ms.
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
              <strong>52× faster than qr-code-styling</strong>, and it stays
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
              <code>toSVGString</code> wins on all 6 data types. Among competing
              libraries, headless qrcode is the clear runner-up, beating
              qrcode.react and react-qr-code on every type. The @ttsalpha React
              path edges ahead of it on alphanumeric, unicode, long URL, and
              vCard, and trails it on short URL and numeric.
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
              All libraries show excellent memory behavior. Peak stays within
              0.15 MB of baseline across 5,000 renders with unique inputs. There
              are no signs of leaks in any library, and @ttsalpha/qrcode&apos;s
              16-entry matrix cache holds steady: the <code>toSVGString</code>{" "}
              path drifts +0.02 MB, the React path +0.07 MB.
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
              qrcode.react stays the smallest at 5.9 KB gzip. @ttsalpha/qrcode
              is the largest of the four that ship a plain SVG pipeline, at 10.7
              KB, up from 7.9 KB in 2.x: 3.0.0 spent bytes on spec fixes and on
              matching React&apos;s style serialisation. It carries zero runtime
              dependencies and is fully tree-shakeable (
              <code>sideEffects: false</code>), so an app that only imports the
              component or only <code>toSVGString</code> pays for less than the
              figure above.
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
                    <td className={`${s.center} ${s.cellWin}`}>16 / 18</td>
                    <td className={s.center}>13 / 18</td>
                    <td className={s.center}>11 / 18</td>
                    <td className={s.center}>9 / 18</td>
                    <td className={s.center}>8 / 18</td>
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
                  <li>Best overall for React 18+</li>
                  <li>
                    Need the fastest true cold start, 3.4× faster than
                    qrcode.react in a fresh process
                  </li>
                  <li>
                    Need <code>toSVGString</code> for SSR, email templates, or
                    batch generation
                  </li>
                  <li>
                    Re-render the same QR often, since the matrix cache makes
                    repeats near-free
                  </li>
                  <li>Need styled QR that works server-side</li>
                  <li>Need logo as any React component</li>
                  <li>Want zero dependencies</li>
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
                  <li>Browser-only, no SSR requirement</li>
                  <li>Willing to accept ~52× slower styled render times</li>
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
                  <li>No strong reason to choose over the others</li>
                  <li>
                    Fewest features and slowest renders among the SSR-safe React
                    libraries
                  </li>
                  <li>Hidden bundle cost from dependencies</li>
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
