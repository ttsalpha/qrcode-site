import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import s from "./page.module.css";

const benchmarkDescription =
  "Performance comparison of @ttsalpha/qrcode vs qrcode.react, qr-code-styling, and react-qr-code — true cold start, SSR, throughput, sequential batch, bundle size, and features.";

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
              against the three most popular React QR libraries:{" "}
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
              , and{" "}
              <a
                href="https://www.npmjs.com/package/react-qr-code"
                target="_blank"
                rel="noopener noreferrer"
                className={s.heroSubLink}
              >
                react-qr-code
              </a>{" "}
              — covering true cold start, SSR latency, throughput, sequential
              batch, bundle size, and feature completeness.
            </p>
            <p className={s.heroBadges}>
              Environment: ubuntu-latest · Node.js v24.16.0 · ECL pinned to M ·
              median / p95 / p99 · June 2026
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
              desc="Key capabilities across all four libraries — before we look at numbers."
            />
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th className={s.center}>@ttsalpha/qrcode</th>
                    <th className={s.center}>qrcode.react</th>
                    <th className={s.center}>qr-code-styling</th>
                    <th className={s.center}>react-qr-code</th>
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
                        ],
                        wins: [],
                      },
                      {
                        feature: "Logo support",
                        vals: [
                          "Image URL + React node",
                          "Image URL",
                          "Image URL",
                          "—",
                        ],
                        wins: [0],
                      },
                      {
                        feature: "Auto ECL for logo",
                        vals: ["✓ auto", "manual only", "manual only", "—"],
                        wins: [0],
                      },
                      {
                        feature: "Custom dot & corner styles",
                        vals: ["✓", "—", "✓", "—"],
                        wins: [0, 2],
                      },
                      {
                        feature: "Standalone string API",
                        vals: ["✓", "—", "—", "—"],
                        wins: [0],
                      },
                      {
                        feature: "SSR / Edge runtime",
                        vals: ["✓", "✓", "✕ browser only", "✓"],
                        wins: [0, 1, 3],
                      },
                      {
                        feature: "Error correction level",
                        vals: ["✓", "✓", "✓", "✓"],
                        wins: [0, 1, 2, 3],
                      },
                      {
                        feature: "QR version control",
                        vals: ["✓", "✓", "✓", "—"],
                        wins: [0, 1, 2],
                      },
                      {
                        feature: "Zero dependencies",
                        vals: ["✓ (0)", "✓ (0)", "✕ (1 dep)", "✕ (2 deps)"],
                        wins: [0, 1],
                      },
                      {
                        feature: "TypeScript built-in",
                        vals: ["✓", "✓", "✓", "✓"],
                        wins: [0, 1, 2, 3],
                      },
                      {
                        feature: "ESM + CJS dual export",
                        vals: ["✓", "✓", "✕", "✓"],
                        wins: [0, 1, 3],
                      },
                      {
                        feature: "Accessibility (aria / title)",
                        vals: ["✓", "✓", "—", "✓"],
                        wins: [0, 1, 3],
                      },
                      {
                        feature: "Bundle size (gzip)",
                        vals: [
                          "8.7 KB",
                          "6.1 KB",
                          "13.8 KB",
                          "∼45 KB (w/deps)",
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
                  value: 2126,
                  winner: true,
                },
                { label: "qrcode.react (SVG)", value: 1714 },
                { label: "@ttsalpha/qrcode (React)", value: 1254 },
                { label: "react-qr-code", value: 1017 },
                { label: "qr-code-styling (async)", value: 79, slow: true },
              ]}
            />
            <p className={s.note}>
              <code>toSVGString</code> reaches <strong>2,126 r/s</strong> — 1.2×
              faster than qrcode.react and 27× faster than qr-code-styling. Runs
              sync with no React or DOM overhead, ideal for server-side and
              batch workloads.
            </p>
          </div>
        </section>

        {/* 2. True Cold Start */}
        <section className={`${s.section} ${s.sectionAlt}`}>
          <div className={s.wrap}>
            <SectionHead
              num="02 — True Cold Start"
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
                      imp: "30.25 ms",
                      impP95: "32.8 ms",
                      r1: "7.026 ms",
                      r1P95: "7.244 ms",
                      r2: "1.369 ms",
                      win: true,
                    },
                    {
                      lib: "@ttsalpha/qrcode (React)",
                      imp: "29.99 ms",
                      impP95: "30.95 ms",
                      r1: "15.41 ms",
                      r1P95: "16.228 ms",
                      r2: "2.795 ms",
                    },
                    {
                      lib: "qrcode.react",
                      imp: "27.59 ms",
                      impP95: "27.96 ms",
                      r1: "14.817 ms",
                      r1P95: "17.839 ms",
                      r2: "4.732 ms",
                    },
                    {
                      lib: "react-qr-code",
                      imp: "32.34 ms",
                      impP95: "35.32 ms",
                      r1: "14.921 ms",
                      r1P95: "17.573 ms",
                      r2: "8.274 ms",
                    },
                    {
                      lib: "qr-code-styling",
                      imp: "4.55 ms",
                      impP95: "4.85 ms",
                      r1: "58 ms",
                      r1P95: "60.281 ms",
                      r2: "37.103 ms",
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
              <code>toSVGString</code> first-renders in{" "}
              <strong>7.026 ms</strong> — 2× faster than qrcode.react (14.817
              ms). qr-code-styling has the fastest import (4.55 ms) but the
              slowest first render (58 ms), and stays slow at 37 ms on the
              second render because its DOM-based async pipeline does not
              JIT-warm effectively.
            </p>
          </div>
        </section>

        {/* 3. SSR Simulation */}
        <section className={s.section}>
          <div className={s.wrap}>
            <SectionHead
              num="03 — SSR Simulation"
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
                      med: "1.256",
                      p95: "1.272",
                      p99: "1.272",
                      win: true,
                    },
                    {
                      lib: "@ttsalpha/qrcode (React)",
                      med: "2.013",
                      p95: "2.286",
                      p99: "2.286",
                    },
                    {
                      lib: "qrcode.react",
                      med: "2.41",
                      p95: "2.839",
                      p99: "2.839",
                    },
                    {
                      lib: "react-qr-code",
                      med: "3.288",
                      p95: "4.129",
                      p99: "4.129",
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
              <strong>1.9× faster than qrcode.react</strong> and 2.6× faster
              than react-qr-code across 12 mixed payloads. Tight p99 (1.272 ms)
              means latency stays predictable even with complex inputs like
              vCard or WiFi configs.
            </p>
          </div>
        </section>

        {/* 4. Sequential Batch */}
        <section className={`${s.section} ${s.sectionAlt}`}>
          <div className={s.wrap}>
            <SectionHead
              num="04 — Sequential Batch"
              title="Burst of N renders, single thread"
              desc="Node.js is single-threaded — React renders run sequentially. Batch=100 (qr-code-styling: 20). 10 rounds."
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
                      med: "115.4",
                      p95: "115.98",
                      avg: "1.154",
                      win: true,
                    },
                    {
                      lib: "qrcode.react",
                      batch: "100",
                      med: "142.91",
                      p95: "146.42",
                      avg: "1.429",
                    },
                    {
                      lib: "@ttsalpha/qrcode (React)",
                      batch: "100",
                      med: "187.7",
                      p95: "191.3",
                      avg: "1.877",
                    },
                    {
                      lib: "react-qr-code",
                      batch: "100",
                      med: "230.86",
                      p95: "237.74",
                      avg: "2.309",
                    },
                    {
                      lib: "qr-code-styling",
                      batch: "20",
                      med: "551.79",
                      p95: "578.37",
                      avg: "27.59",
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
              <strong>115.4 ms median</strong> (1.154 ms/render) — 1.24× faster
              than qrcode.react. qr-code-styling takes 552 ms for just 20
              renders; at that rate, 100 renders would take ~2,760 ms.
            </p>
          </div>
        </section>

        {/* 5. Styled QR */}
        <section className={s.section}>
          <div className={s.wrap}>
            <SectionHead
              num="05 — Styled QR"
              title="Custom dot shapes + corner styles"
              desc="ECL=H (logo-safe), size=512 px. Only @ttsalpha/qrcode and qr-code-styling support custom styling."
            />
            <BarChart
              rows={[
                {
                  label: "@ttsalpha/qrcode (toSVGString)",
                  value: 0.622,
                  winner: true,
                },
                { label: "@ttsalpha/qrcode (React)", value: 1.136 },
                {
                  label: "qr-code-styling (async DOM)",
                  value: 12.231,
                  slow: true,
                },
              ]}
            />
            <p className={s.note}>
              @ttsalpha/qrcode renders styled QR codes{" "}
              <strong>20× faster than qr-code-styling</strong> — while remaining
              SSR-safe, sync, and DOM-free. qr-code-styling requires a browser
              environment (JSDOM polyfill for Node.js/Edge) with an async API
              that does not scale.
              <br />
              <br />
              qrcode.react and react-qr-code have no styling API.
            </p>
          </div>
        </section>

        {/* 6. Data Complexity */}
        <section className={`${s.section} ${s.sectionAlt}`}>
          <div className={s.wrap}>
            <SectionHead
              num="06 — Data Complexity"
              title="Per-type render time"
              desc="500 samples each, p99 included. Lower is better."
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
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      type: "Short URL",
                      vals: ["0.447 ms", "0.928 ms", "0.55 ms", "1.001 ms"],
                      win: 0,
                    },
                    {
                      type: "Numeric (20 digits)",
                      vals: ["0.264 ms", "0.724 ms", "0.425 ms", "1.003 ms"],
                      win: 0,
                    },
                    {
                      type: "AlphaNumeric",
                      vals: ["0.447 ms", "0.92 ms", "0.595 ms", "0.955 ms"],
                      win: 0,
                    },
                    {
                      type: "Unicode (Japanese)",
                      vals: ["0.665 ms", "0.834 ms", "0.797 ms", "1.354 ms"],
                      win: 0,
                    },
                    {
                      type: "Long URL (120 chars)",
                      vals: ["1.744 ms", "2.377 ms", "1.732 ms", "3.054 ms"],
                      win: 2,
                    },
                    {
                      type: "vCard",
                      vals: ["1.453 ms", "2.032 ms", "1.443 ms", "2.592 ms"],
                      win: 2,
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
              <code>toSVGString</code> wins on 4 of 6 data types. qrcode.react
              edges ahead on long URL (1.732 ms vs 1.744 ms) and vCard (1.443 ms
              vs 1.453 ms) — both within 1%, negligible in practice.
            </p>
          </div>
        </section>

        {/* 7. Memory */}
        <section className={s.section}>
          <div className={s.wrap}>
            <SectionHead
              num="07 — Memory Stability"
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
                      base: "44.54 MB",
                      peak: "44.55 MB",
                      fin: "44.56 MB",
                      drift: "+0.02 MB",
                      win: true,
                    },
                    {
                      lib: "@ttsalpha/qrcode (React)",
                      base: "44.53 MB",
                      peak: "44.61 MB",
                      fin: "44.55 MB",
                      drift: "+0.02 MB",
                    },
                    {
                      lib: "react-qr-code",
                      base: "44.58 MB",
                      peak: "44.62 MB",
                      fin: "44.57 MB",
                      drift: "−0.01 MB",
                    },
                    {
                      lib: "qrcode.react",
                      base: "44.63 MB",
                      peak: "44.72 MB",
                      fin: "44.56 MB",
                      drift: "−0.07 MB",
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
              0.18 MB of baseline across 5,000 renders with unique inputs. No
              signs of leaks in any library.
            </p>
          </div>
        </section>

        {/* 8. Bundle Size */}
        <section className={`${s.section} ${s.sectionAlt}`}>
          <div className={s.wrap}>
            <SectionHead num="08 — Bundle Size" title="gzip + dependencies" />
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Library</th>
                    <th>Min (KB)</th>
                    <th>Gzip (KB)</th>
                    <th>Dependencies</th>
                    <th>Actual total</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      lib: "qrcode.react",
                      min: "16.3",
                      gz: "6.1",
                      deps: "0",
                      total: "16.3 KB",
                      winGz: true,
                    },
                    {
                      lib: "@ttsalpha/qrcode",
                      min: "28.5",
                      gz: "8.7",
                      deps: "0",
                      total: "28.5 KB",
                    },
                    {
                      lib: "react-qr-code",
                      min: "23.4",
                      gz: "8.5",
                      deps: "2",
                      total: "~45 KB ⚠️",
                    },
                    {
                      lib: "qr-code-styling",
                      min: "46.9",
                      gz: "13.8",
                      deps: "1",
                      total: "46.9 KB",
                    },
                  ].map(({ lib, min, gz, deps, total, winGz }) => (
                    <tr key={lib}>
                      <td>{lib}</td>
                      <td>{min}</td>
                      <td className={winGz ? s.cellWin : ""}>{gz}</td>
                      <td>{deps}</td>
                      <td>{total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={s.note}>
              react-qr-code ships 23 KB but silently pulls in{" "}
              <code>qrcode-generator</code> (~40 KB) and <code>prop-types</code>{" "}
              (~1 KB) — nearly double the apparent size.
            </p>
          </div>
        </section>

        {/* 9. Feature Comparison */}
        <section className={s.section}>
          <div className={s.wrap}>
            <SectionHead num="09 — Features" title="Capability comparison" />
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th className={s.center}>@ttsalpha/qrcode</th>
                    <th className={s.center}>qrcode.react</th>
                    <th className={s.center}>qr-code-styling</th>
                    <th className={s.center}>react-qr-code</th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      ["SVG output", true, true, true, true],
                      ["Canvas output", false, true, true, false],
                      ["PNG export", true, false, true, false],
                      [
                        "toSVGString() — sync, no DOM",
                        true,
                        false,
                        false,
                        false,
                      ],
                      ["SSR / Edge runtime safe", true, true, null, true],
                      ["Zero dependencies", true, true, false, false],
                      ["Dot shape styles", true, false, true, false],
                      ["Corner styles", true, false, true, false],
                      ["Logo — image URL", true, true, true, false],
                      ["Logo — any React node", true, false, false, false],
                      ["Error correction level", true, true, true, true],
                      ["QR version control", true, true, true, false],
                      ["TypeScript built-in", true, true, true, true],
                      ["ESM + CJS dual export", true, true, false, true],
                      ["Accessibility (aria / title)", true, true, false, true],
                      ["React 18+ support", true, true, true, true],
                      ["React 16 / 17 support", false, true, true, true],
                    ] as [string, boolean, boolean, boolean | null, boolean][]
                  ).map(([feature, a, b, c, d]) => (
                    <tr key={feature}>
                      <td>{feature}</td>
                      {[a, b, c, d].map((v, i) => (
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
                    <td className={`${s.center} ${s.cellWin}`}>15 / 17</td>
                    <td className={s.center}>12 / 17</td>
                    <td className={s.center}>11 / 17</td>
                    <td className={s.center}>8 / 17</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 10. Summary */}
        <section className={`${s.section} ${s.sectionAlt}`}>
          <div className={s.wrap}>
            <SectionHead num="10 — Summary" title="Rankings" />
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th className={s.center}>@ttsalpha/qrcode</th>
                    <th className={s.center}>qrcode.react</th>
                    <th className={s.center}>qr-code-styling</th>
                    <th className={s.center}>react-qr-code</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      cat: "Throughput",
                      vals: ["#1", "#2", "✕", "#3"],
                      win: 0,
                    },
                    {
                      cat: "True cold start",
                      vals: ["#1", "#2", "✕", "#3"],
                      win: 0,
                    },
                    {
                      cat: "SSR latency",
                      vals: ["#1", "#2", "✕", "#3"],
                      win: 0,
                    },
                    {
                      cat: "Sequential batch",
                      vals: ["#1", "#2", "✕", "#3"],
                      win: 0,
                    },
                    { cat: "Styled QR", vals: ["#1", "—", "#2", "—"], win: 0 },
                    {
                      cat: "Bundle size",
                      vals: ["#2", "#1", "#3", "#4"],
                      win: 1,
                    },
                    {
                      cat: "Feature score",
                      vals: ["#1", "#2", "#3", "#4"],
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
        <section className={s.section}>
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
        <section className={`${s.section} ${s.sectionAlt}`}>
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
                    Need the fastest true cold start — 2× faster than
                    qrcode.react in a fresh process
                  </li>
                  <li>
                    Need <code>toSVGString</code> for SSR, email templates, or
                    batch generation
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
                  <li>Willing to accept ~20× slower styled render times</li>
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
            </div>
          </div>
        </section>
      </main>

      <SiteFooter maxWidth={920} showDocsLink />
    </>
  );
}
