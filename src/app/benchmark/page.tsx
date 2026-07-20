import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import s from "./page.module.css";

const benchmarkDescription =
  "Performance comparison of @ttsalpha/qrcode vs qrcode.react, qr-code-styling, react-qr-code, and qrcode — true cold start, SSR, throughput, repeated-value caching, sequential batch, bundle size, and features.";

export const metadata: Metadata = {
  title: "Benchmark",
  description: benchmarkDescription,
  alternates: { canonical: "/benchmark" },
  openGraph: {
    title: "Benchmark | @ttsalpha/qrcode",
    description: benchmarkDescription,
    url: "https://qrcode.ttsalpha.com/benchmark",
  },
  twitter: {
    title: "Benchmark | @ttsalpha/qrcode",
    description: benchmarkDescription,
  },
};

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
  "@type": "Dataset",
  name: "React QR Code Library Benchmark",
  description: benchmarkDescription,
  url: "https://qrcode.ttsalpha.com/benchmark",
  creator: {
    "@type": "Person",
    name: "Son Tran",
    url: "https://github.com/ttsalpha",
  },
  license: "https://github.com/ttsalpha/qrcode-benchmark",
  variableMeasured: [
    "Throughput (renders/second)",
    "Repeated-value caching",
    "True cold start latency",
    "SSR latency",
    "Sequential batch time",
    "Bundle size",
  ],
};

export default function BenchmarkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(benchmarkJsonLd) }}
      />
      <SiteNav maxWidth={920} />

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
              against the three most popular React QR libraries —{" "}
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
                href="https://www.npmjs.com/package/qr-code-styling"
                target="_blank"
                rel="noopener noreferrer"
                className={s.heroSubLink}
              >
                qr-code-styling
              </a>
              ,{" "}
              <a
                href="https://www.npmjs.com/package/react-qr-code"
                target="_blank"
                rel="noopener noreferrer"
                className={s.heroSubLink}
              >
                react-qr-code
              </a>{" "}
              — and the most-downloaded QR package on npm,{" "}
              <a
                href="https://www.npmjs.com/package/qrcode"
                target="_blank"
                rel="noopener noreferrer"
                className={s.heroSubLink}
              >
                qrcode
              </a>{" "}
              (headless baseline) — covering true cold start, SSR latency,
              throughput, repeated-value caching, sequential batch, bundle size,
              and feature completeness.
            </p>
            <p className={s.heroBadges}>
              Environment: ubuntu-latest · Node.js v24.18.0 · ECL pinned to M ·
              median / p95 / p99 · July 2026
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
              desc="Key capabilities across all five libraries — before we look at numbers."
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
                  {(
                    [
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
                        vals: ["✓", "✓", "✓", "✓", "—"],
                        wins: [0, 1, 2, 3],
                      },
                      {
                        feature: "Logo support",
                        vals: ["URL + React node", "URL", "URL", "—", "—"],
                        wins: [0],
                      },
                      {
                        feature: "Auto ECL for logo",
                        vals: [
                          "✓ auto",
                          "manual only",
                          "manual only",
                          "—",
                          "—",
                        ],
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
                        vals: [
                          "✓ (0)",
                          "✓ (0)",
                          "✕ (1 dep)",
                          "✕ (2 deps)",
                          "✕ (3 deps)",
                        ],
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
                        vals: [
                          "8.9 KB",
                          "6.1 KB",
                          "14.7 KB",
                          "9.0 KB",
                          "9.5 KB",
                        ],
                        wins: [1],
                      },
                    ] as {
                      feature: string;
                      vals: string[];
                      wins: number[];
                    }[]
                  ).map(({ feature, vals, wins }) => (
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
              desc="Each call receives a distinct URL — no lib can benefit from caching. Higher r/s is better."
            />
            <BarChart
              unit="r/s"
              rows={[
                {
                  label: "@ttsalpha/qrcode (toSVGString)",
                  value: 5065,
                  winner: true,
                },
                { label: "qrcode (headless)", value: 4504 },
                { label: "@ttsalpha/qrcode (React)", value: 2908 },
                { label: "qrcode.react (SVG)", value: 1770 },
                { label: "react-qr-code", value: 1011 },
                { label: "qr-code-styling (async)", value: 80, slow: true },
              ]}
            />
            <p className={s.note}>
              <code>toSVGString</code> reaches <strong>5,065 r/s</strong> — 2.9×
              faster than qrcode.react and 63× faster than qr-code-styling. Even
              the React component path (2,908 r/s) outruns every other React
              library. Runs sync with no React or DOM overhead, ideal for
              server-side and batch workloads.
            </p>
          </div>
        </section>

        {/* 2. Repeated Value */}
        <section className={`${s.section} ${s.sectionAlt}`}>
          <div className={s.wrap}>
            <SectionHead
              num="02 — Repeated Value"
              title="Same input every render"
              desc="Re-rendering one QR across requests or mounts — receipts, kiosk screens, shared links. @ttsalpha/qrcode ≥2.4 memoizes matrices in a 16-entry LRU, so this test is expected to favor it by design; it is kept separate from the cold-path tests above."
            />
            <BarChart
              unit="r/s"
              rows={[
                {
                  label: "@ttsalpha/qrcode (toSVGString)",
                  value: 11101,
                  winner: true,
                },
                { label: "@ttsalpha/qrcode (React)", value: 5093 },
                { label: "qrcode (headless)", value: 3376 },
                { label: "qrcode.react (SVG)", value: 1325 },
                { label: "react-qr-code", value: 742 },
                { label: "qr-code-styling (async)", value: 58, slow: true },
              ]}
            />
            <p className={s.note}>
              With the matrix cache hitting, <code>toSVGString</code> reaches{" "}
              <strong>11,101 r/s</strong> — 3.3× the headless qrcode baseline
              and 8.4× qrcode.react. No other library caches by value — this
              payload is slightly longer than test 01&apos;s, so their numbers
              sit a notch below their cold-path throughput.
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
                  {[
                    {
                      lib: "@ttsalpha/qrcode (toSVGString)",
                      imp: "30.01 ms",
                      impP95: "36.44 ms",
                      r1: "3.913 ms",
                      r1P95: "4.178 ms",
                      r2: "0.95 ms",
                      win: true,
                    },
                    {
                      lib: "qrcode (headless)",
                      imp: "21.1 ms",
                      impP95: "23.3 ms",
                      r1: "8.127 ms",
                      r1P95: "8.901 ms",
                      r2: "1.418 ms",
                    },
                    {
                      lib: "@ttsalpha/qrcode (React)",
                      imp: "29.12 ms",
                      impP95: "29.31 ms",
                      r1: "11.139 ms",
                      r1P95: "14.104 ms",
                      r2: "1.961 ms",
                    },
                    {
                      lib: "qrcode.react",
                      imp: "26.5 ms",
                      impP95: "28.95 ms",
                      r1: "13.832 ms",
                      r1P95: "16.683 ms",
                      r2: "4.207 ms",
                    },
                    {
                      lib: "react-qr-code",
                      imp: "30.84 ms",
                      impP95: "34.88 ms",
                      r1: "16.542 ms",
                      r1P95: "20.376 ms",
                      r2: "8.884 ms",
                    },
                    {
                      lib: "qr-code-styling",
                      imp: "4.36 ms",
                      impP95: "4.42 ms",
                      r1: "54.114 ms",
                      r1P95: "55.326 ms",
                      r2: "31.919 ms",
                      slow: true,
                    },
                  ].map(({ lib, imp, impP95, r1, r1P95, r2, win, slow }) => (
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
                  ))}
                </tbody>
              </table>
            </div>
            <p className={s.note}>
              <code>toSVGString</code> first-renders in <strong>3.91 ms</strong>{" "}
              — 2× faster than the headless qrcode baseline (8.127 ms) and 3.5×
              faster than qrcode.react (13.832 ms). qrcode has the lightest
              import among full pipelines (21.1 ms vs our 30.01 ms — we also
              load React), but loses it back on the first render.
              qr-code-styling imports fastest (4.36 ms) yet first-renders in 54
              ms and stays slow at 32 ms because its DOM-based async pipeline
              does not JIT-warm effectively.
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
                  {[
                    {
                      lib: "@ttsalpha/qrcode (toSVGString)",
                      med: "0.589",
                      p95: "0.635",
                      p99: "0.635",
                      win: true,
                    },
                    {
                      lib: "@ttsalpha/qrcode (React)",
                      med: "1.339",
                      p95: "1.514",
                      p99: "1.514",
                    },
                    {
                      lib: "qrcode (headless)",
                      med: "1.589",
                      p95: "1.827",
                      p99: "1.827",
                    },
                    {
                      lib: "qrcode.react",
                      med: "2.665",
                      p95: "3.014",
                      p99: "3.014",
                    },
                    {
                      lib: "react-qr-code",
                      med: "3.278",
                      p95: "4.029",
                      p99: "4.029",
                    },
                    {
                      lib: "qr-code-styling",
                      med: "✕ Not SSR-safe",
                      p95: "—",
                      p99: "—",
                    },
                  ].map(({ lib, med, p95, p99, win }) => (
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
              <strong>2.7× faster than the headless qrcode baseline</strong> and
              4.5× faster than qrcode.react across 12 mixed payloads. Tight p99
              (0.635 ms) means latency stays predictable even with complex
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
              desc="Node.js is single-threaded — React renders run sequentially. Batch=100 (qr-code-styling: 20). 20 rounds (qr-code-styling: 10)."
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
                  {[
                    {
                      lib: "@ttsalpha/qrcode (toSVGString)",
                      batch: "100",
                      med: "49.3",
                      p95: "51.16",
                      avg: "0.493",
                      win: true,
                    },
                    {
                      lib: "qrcode (headless)",
                      batch: "100",
                      med: "69.25",
                      p95: "74.46",
                      avg: "0.693",
                    },
                    {
                      lib: "@ttsalpha/qrcode (React)",
                      batch: "100",
                      med: "103.98",
                      p95: "118.52",
                      avg: "1.04",
                    },
                    {
                      lib: "qrcode.react",
                      batch: "100",
                      med: "147.32",
                      p95: "149.78",
                      avg: "1.473",
                    },
                    {
                      lib: "react-qr-code",
                      batch: "100",
                      med: "249.48",
                      p95: "256.21",
                      avg: "2.495",
                    },
                    {
                      lib: "qr-code-styling",
                      batch: "20",
                      med: "560.92",
                      p95: "580.53",
                      avg: "28.046",
                      slow: true,
                    },
                  ].map(({ lib, batch, med, p95, avg, win, slow }) => (
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
                  ))}
                </tbody>
              </table>
            </div>
            <p className={s.note}>
              <code>toSVGString</code> completes 100 renders in{" "}
              <strong>49.3 ms median</strong> (0.493 ms/render) — 1.4× faster
              than the headless qrcode baseline and 3× faster than qrcode.react.
              qr-code-styling takes 561 ms for just 20 renders; at that rate,
              100 renders would take ~2,805 ms.
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
            <BarChart
              rows={[
                {
                  label: "@ttsalpha/qrcode (toSVGString)",
                  value: 0.345,
                  winner: true,
                },
                { label: "@ttsalpha/qrcode (React)", value: 0.924 },
                {
                  label: "qr-code-styling (async DOM)",
                  value: 11.831,
                  slow: true,
                },
              ]}
            />
            <p className={s.note}>
              @ttsalpha/qrcode renders styled QR codes{" "}
              <strong>34× faster than qr-code-styling</strong> — while remaining
              SSR-safe, sync, and DOM-free. qr-code-styling requires a browser
              environment (JSDOM polyfill for Node.js/Edge) with an async API
              that does not scale.
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
              desc="500 samples each, unique input, p99 included. Lower is better."
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
                  {[
                    {
                      type: "Short URL",
                      vals: [
                        "0.172 ms",
                        "0.582 ms",
                        "0.576 ms",
                        "1.04 ms",
                        "0.237 ms",
                      ],
                      win: 0,
                    },
                    {
                      type: "Numeric (20 digits)",
                      vals: [
                        "0.107 ms",
                        "0.185 ms",
                        "0.449 ms",
                        "1.031 ms",
                        "0.125 ms",
                      ],
                      win: 0,
                    },
                    {
                      type: "AlphaNumeric",
                      vals: [
                        "0.173 ms",
                        "0.575 ms",
                        "0.624 ms",
                        "0.973 ms",
                        "0.231 ms",
                      ],
                      win: 0,
                    },
                    {
                      type: "Unicode (Japanese)",
                      vals: [
                        "0.254 ms",
                        "0.414 ms",
                        "0.817 ms",
                        "1.399 ms",
                        "0.269 ms",
                      ],
                      win: 0,
                    },
                    {
                      type: "Long URL (120 chars)",
                      vals: [
                        "0.644 ms",
                        "0.745 ms",
                        "1.758 ms",
                        "3.167 ms",
                        "0.65 ms",
                      ],
                      win: 0,
                    },
                    {
                      type: "vCard",
                      vals: [
                        "0.541 ms",
                        "0.638 ms",
                        "1.481 ms",
                        "2.681 ms",
                        "0.622 ms",
                      ],
                      win: 0,
                    },
                  ].map(({ type, vals, win }) => (
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
              <code>toSVGString</code> wins on all 6 data types. The headless
              qrcode baseline stays a close second (within 1% on long URL) — the
              gap widens on short and alphanumeric payloads where encoding
              overhead dominates.
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
                  {[
                    {
                      lib: "@ttsalpha/qrcode (toSVGString)",
                      base: "45.64 MB",
                      peak: "45.68 MB",
                      fin: "45.65 MB",
                      drift: "+0.01 MB",
                      win: true,
                    },
                    {
                      lib: "@ttsalpha/qrcode (React)",
                      base: "45.67 MB",
                      peak: "45.75 MB",
                      fin: "45.66 MB",
                      drift: "−0.01 MB",
                    },
                    {
                      lib: "react-qr-code",
                      base: "45.68 MB",
                      peak: "45.75 MB",
                      fin: "45.68 MB",
                      drift: "0 MB",
                    },
                    {
                      lib: "qrcode.react",
                      base: "45.72 MB",
                      peak: "45.82 MB",
                      fin: "45.66 MB",
                      drift: "−0.07 MB",
                    },
                    {
                      lib: "qrcode (headless)",
                      base: "45.74 MB",
                      peak: "45.86 MB",
                      fin: "45.79 MB",
                      drift: "+0.05 MB",
                    },
                  ].map(({ lib, base, peak, fin, drift, win }) => (
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
              All libraries show excellent memory behavior — peak stays within
              0.15 MB of baseline across 5,000 renders with unique inputs. No
              signs of leaks in any library; @ttsalpha/qrcode&apos;s 16-entry
              matrix cache holds steady within ±0.01 MB.
            </p>
          </div>
        </section>

        {/* 9. Bundle Size */}
        <section className={s.section}>
          <div className={s.wrap}>
            <SectionHead
              num="09 — Bundle Size"
              title="Minified + gzip, dependencies bundled"
              desc="Measured with esbuild (browser ESM, react/react-dom external). Each lib's own dependencies are included in its number."
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
                  {[
                    {
                      lib: "qrcode.react",
                      min: "16.3",
                      gz: "6.1",
                      deps: "0",
                      winGz: true,
                    },
                    {
                      lib: "@ttsalpha/qrcode",
                      min: "27.6",
                      gz: "8.9",
                      deps: "0",
                    },
                    {
                      lib: "react-qr-code",
                      min: "24.3",
                      gz: "9.0",
                      deps: "2 (bundled)",
                    },
                    {
                      lib: "qrcode",
                      min: "24.3",
                      gz: "9.5",
                      deps: "3 (bundled)",
                    },
                    {
                      lib: "qr-code-styling",
                      min: "47.5",
                      gz: "14.7",
                      deps: "1 (bundled)",
                    },
                  ].map(({ lib, min, gz, deps, winGz }) => (
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
              qrcode.react stays the smallest at 6.1 KB gzip. @ttsalpha/qrcode
              lands at 8.9 KB with zero dependencies and is fully tree-shakeable
              (<code>sideEffects: false</code>) — apps that only use the
              component don&apos;t pay for the export helpers.
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
                  {(
                    [
                      ["SVG output", true, true, true, true, true],
                      ["Canvas output", false, true, true, false, true],
                      ["PNG export", true, false, true, false, true],
                      [
                        "toSVGString() — sync, no DOM",
                        true,
                        false,
                        false,
                        false,
                        false,
                      ],
                      ["React component", true, true, true, true, false],
                      ["SSR / Edge runtime safe", true, true, null, true, true],
                      ["Zero dependencies", true, true, false, false, false],
                      ["Dot shape styles", true, false, true, false, false],
                      ["Corner styles", true, false, true, false, false],
                      ["Logo — image URL", true, true, true, false, false],
                      [
                        "Logo — any React node",
                        true,
                        false,
                        false,
                        false,
                        false,
                      ],
                      ["Error correction level", true, true, true, true, true],
                      ["QR version control", true, true, true, false, true],
                      ["TypeScript built-in", true, true, true, true, false],
                      ["ESM + CJS dual export", true, true, false, true, false],
                      [
                        "Accessibility (aria / title)",
                        true,
                        true,
                        false,
                        true,
                        false,
                      ],
                      ["React 18+ support", true, true, true, true, true],
                      ["React 16 / 17 support", false, true, true, true, true],
                    ] as [
                      string,
                      boolean,
                      boolean,
                      boolean | null,
                      boolean,
                      boolean,
                    ][]
                  ).map(([feature, a, b, c, d, e]) => (
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
                    <td className={s.center}>12 / 18</td>
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
                  {[
                    {
                      cat: "Throughput",
                      vals: ["#1", "#3", "✕", "#4", "#2"],
                      win: 0,
                    },
                    {
                      cat: "Repeated value",
                      vals: ["#1", "#3", "✕", "#4", "#2"],
                      win: 0,
                    },
                    {
                      cat: "True cold start",
                      vals: ["#1", "#3", "✕", "#4", "#2"],
                      win: 0,
                    },
                    {
                      cat: "SSR latency",
                      vals: ["#1", "#3", "✕", "#4", "#2"],
                      win: 0,
                    },
                    {
                      cat: "Sequential batch",
                      vals: ["#1", "#3", "✕", "#4", "#2"],
                      win: 0,
                    },
                    {
                      cat: "Styled QR",
                      vals: ["#1", "—", "#2", "—", "—"],
                      win: 0,
                    },
                    {
                      cat: "Bundle size",
                      vals: ["#2", "#1", "#5", "#3", "#4"],
                      win: 1,
                    },
                    {
                      cat: "Feature score",
                      vals: ["#1", "#2", "#3", "#4", "#5"],
                      win: 0,
                    },
                  ].map(({ cat, vals, win }) => (
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
                    Need the fastest true cold start — 3.5× faster than
                    qrcode.react in a fresh process
                  </li>
                  <li>
                    Need <code>toSVGString</code> for SSR, email templates, or
                    batch generation
                  </li>
                  <li>
                    Re-render the same QR often — the matrix cache makes repeats
                    near-free
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
                  <li>Bundle size is the primary constraint (6.1 KB gzip)</li>
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
                  <li>Willing to accept ~34× slower styled render times</li>
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
                  <li>Fewest features, slowest renders</li>
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
                  <li>Async-only API and no styling — plain QR codes only</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter maxWidth={920} showDocsLink />
    </>
  );
}
