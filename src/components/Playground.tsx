"use client";

import type {
  CornerDotStyle,
  CornerSquareStyle,
  DotStyle,
  QRCodeProps,
} from "@ttsalpha/qrcode";
import { QRCode, toDataURL, toSVGString } from "@ttsalpha/qrcode";
import { track } from "@vercel/analytics";
import type { CSSProperties } from "react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  IoAdd,
  IoChevronDown,
  IoClose,
  IoCloudUploadOutline,
  IoCopyOutline,
  IoDownloadOutline,
} from "react-icons/io5";
import { createHighlighter, type Highlighter, type ThemedToken } from "shiki";
import CopyButton from "./CopyButton";
import s from "./Playground.module.css";

type ExportFormat = "svg" | "png" | "jpg";

// <input type="color"> only accepts 6-digit hex; guard so partial/named
// values don't silently coerce the swatch to black
const HEX6 = /^#[0-9a-fA-F]{6}$/;

// Shown when the input is empty — the field starts blank (placeholder visible)
// but the QR still encodes this so the preview is never empty
const DEFAULT_VALUE = "https://github.com/ttsalpha/qrcode";

let highlighterPromise: Promise<Highlighter> | null = null;
function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: ["tsx"],
    });
  }
  return highlighterPromise;
}

function tokenStyle(token: ThemedToken): CSSProperties {
  return (token.htmlStyle as CSSProperties | undefined) ?? {};
}

type ECL = "" | "L" | "M" | "Q" | "H";

type Preset = {
  name: string;
  dotStyle: DotStyle;
  dotColor: string;
  bgColor: string;
  sqStyle: CornerSquareStyle;
  sqColor: string;
  dotSt: CornerDotStyle;
  dotDotColor: string;
};

// One-tap starting styles for non-technical users. Presets set appearance only —
// they never touch the user's content, logo, size or margin.
const PRESETS: Preset[] = [
  {
    name: "Classic",
    dotStyle: "square",
    dotColor: "#000000",
    bgColor: "#ffffff",
    sqStyle: "square",
    sqColor: "",
    dotSt: "square",
    dotDotColor: "",
  },
  {
    name: "Rounded",
    dotStyle: "rounded",
    dotColor: "#0f172a",
    bgColor: "#ffffff",
    sqStyle: "extra-rounded",
    sqColor: "#14b8a6",
    dotSt: "rounded",
    dotDotColor: "",
  },
  {
    name: "Dots",
    dotStyle: "circle",
    dotColor: "#000000",
    bgColor: "#ffffff",
    sqStyle: "circle",
    sqColor: "",
    dotSt: "circle",
    dotDotColor: "",
  },
  {
    name: "Sky",
    dotStyle: "rounded",
    dotColor: "#0369a1",
    bgColor: "#ffffff",
    sqStyle: "extra-rounded",
    sqColor: "#0ea5e9",
    dotSt: "rounded",
    dotDotColor: "#0369a1",
  },
  {
    name: "Rose",
    dotStyle: "circle",
    dotColor: "#be123c",
    bgColor: "#ffffff",
    sqStyle: "circle",
    sqColor: "#f43f5e",
    dotSt: "circle",
    dotDotColor: "#be123c",
  },
];

// Static thumbnail — memoized so the 5 preset QRs don't re-encode on every render
const PresetThumb = memo(function PresetThumb({ p }: { p: Preset }) {
  return (
    <QRCode
      value="ttsalpha"
      ariaLabel=""
      size={56}
      margin={2}
      qr={{ errorCorrectionLevel: "L" }}
      dotStyle={p.dotStyle}
      dotColor={p.dotColor}
      backgroundColor={p.bgColor}
      corner={{
        square: { style: p.sqStyle, color: p.sqColor || undefined },
        dot: { style: p.dotSt, color: p.dotDotColor || undefined },
      }}
    />
  );
});

export default function Playground() {
  // Content
  const [value, setValue] = useState("");

  // Appearance
  const [dotStyle, setDotStyle] = useState<DotStyle>("rounded");
  const [dotColor, setDotColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  // Dimensions
  const [size, setSize] = useState(256);
  const [margin, setMargin] = useState(4);

  // Corners
  const [sqStyle, setSqStyle] = useState<CornerSquareStyle>("extra-rounded");
  const [sqColor, setSqColor] = useState("#14b8a6");
  const [dotSt, setDotSt] = useState<CornerDotStyle>("rounded");
  const [dotDotColor, setDotDotColor] = useState("");

  // QR Options
  const [ecl, setEcl] = useState<ECL>("");
  const [qrVersion, setQrVersion] = useState<number | "">("");

  // Logo
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFileName, setLogoFileName] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState<number | "">("");
  const [logoMargin, setLogoMargin] = useState<number | "">("");
  const [logoHideDots, setLogoHideDots] = useState(true);

  // Code snippet collapsed by default — end-user first; devs expand it
  const [codeOpen, setCodeOpen] = useState(false);

  // Controls grouped into tabs to avoid a long vertical stack
  const [tab, setTab] = useState<"Style" | "Color" | "Logo" | "Advanced">(
    "Style",
  );

  const [exportError, setExportError] = useState<string | null>(null);
  const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function flashError(msg: string) {
    setExportError(msg);
    if (errorTimer.current) clearTimeout(errorTimer.current);
    errorTimer.current = setTimeout(() => setExportError(null), 4000);
  }

  const hasInteracted = useRef(false);
  function trackEvent(name: string, props?: Record<string, string>) {
    if (!hasInteracted.current) {
      hasInteracted.current = true;
      track("playground_first_interact");
    }
    track(name, props);
  }

  function applyPreset(p: Preset) {
    trackEvent("preset_apply", { name: p.name });
    setDotStyle(p.dotStyle);
    setDotColor(p.dotColor);
    setBgColor(p.bgColor);
    setSqStyle(p.sqStyle);
    setSqColor(p.sqColor);
    setDotSt(p.dotSt);
    setDotDotColor(p.dotDotColor);
  }

  const [containerSize, setContainerSize] = useState(256);
  const [tokens, setTokens] = useState<ThemedToken[][] | null>(null);
  const [preStyle, setPreStyle] = useState<CSSProperties>({});

  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleLogoFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoUrl(ev.target?.result as string);
      setLogoFileName(file.name);
      trackEvent("logo_added", { method: "upload" });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function clearLogoUrl() {
    setLogoUrl("");
    setLogoFileName(null);
  }

  async function resolveLogoSrc(src: string): Promise<string> {
    if (!src || src.startsWith("data:") || src.startsWith("blob:")) return src;
    const fetchUrl = src.startsWith("http")
      ? `/api/proxy-image?url=${encodeURIComponent(src)}`
      : src;
    const res = await fetch(fetchUrl);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function buildProps(): QRCodeProps {
    return {
      value: value.trim() || DEFAULT_VALUE,
      size,
      margin,
      dotStyle,
      dotColor,
      backgroundColor: bgColor,
      corner: {
        square: { style: sqStyle, color: sqColor || undefined },
        dot: { style: dotSt, color: dotDotColor || undefined },
      },
      qr: {
        errorCorrectionLevel: ecl || undefined,
        version: qrVersion !== "" ? (qrVersion as number) : undefined,
      },
      logo: logoUrl
        ? {
            src: logoUrl,
            size: logoSize !== "" ? (logoSize as number) : undefined,
            margin: logoMargin !== "" ? (logoMargin as number) : undefined,
            hideDots: logoHideDots,
          }
        : undefined,
    };
  }

  async function buildExportProps(): Promise<QRCodeProps> {
    const props = buildProps();
    if (!props.logo?.src) return props;
    const resolvedSrc = await resolveLogoSrc(props.logo.src);
    return { ...props, logo: { ...props.logo, src: resolvedSrc } };
  }

  async function handleCopy(fmt: ExportFormat) {
    trackEvent("export_copy", { format: fmt });
    try {
      const props = await buildExportProps();
      if (fmt === "svg") {
        await navigator.clipboard.writeText(toSVGString(props));
      } else {
        const dataUrl = await toDataURL(props, {
          format: fmt === "jpg" ? "jpeg" : "png",
        });
        const blob = await fetch(dataUrl).then((r) => r.blob());
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
      }
    } catch {
      flashError("Couldn't copy — check the logo URL or clipboard access.");
      throw new Error("copy failed");
    }
  }

  async function handleDownload(fmt: ExportFormat) {
    trackEvent("export_download", { format: fmt });
    try {
      const props = await buildExportProps();
      if (fmt === "svg") {
        const blob = new Blob([toSVGString(props)], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "qrcode.svg";
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const dataUrl = await toDataURL(props, {
          format: fmt === "jpg" ? "jpeg" : "png",
        });
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `qrcode.${fmt}`;
        a.click();
      }
    } catch {
      flashError("Couldn't export — check the logo URL.");
      throw new Error("download failed");
    }
  }
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerSize(Math.floor(entry.contentRect.width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const previewScale = Math.min(1, containerSize / size);
  const previewSize = Math.round(size * previewScale);

  // Pre-validate when version is manually set — prevents throwing inside render
  const qrError = useMemo<string | null>(() => {
    if (qrVersion === "") return null;
    try {
      toSVGString({
        value: value.trim() || DEFAULT_VALUE,
        qr: {
          errorCorrectionLevel: ecl || undefined,
          version: qrVersion as number,
        },
      });
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : String(e);
    }
  }, [value, ecl, qrVersion]);

  // Build snippet — only non-default values
  const snippetParts: string[] = [`  value="${value.trim() || DEFAULT_VALUE}"`];
  if (size !== 256) snippetParts.push(`  size={${size}}`);
  if (margin !== 4) snippetParts.push(`  margin={${margin}}`);
  if (dotStyle !== "square") snippetParts.push(`  dotStyle="${dotStyle}"`);
  if (dotColor !== "#000000") snippetParts.push(`  dotColor="${dotColor}"`);
  if (bgColor !== "#ffffff")
    snippetParts.push(`  backgroundColor="${bgColor}"`);

  const sqParts: string[] = [];
  if (sqStyle !== "square") sqParts.push(`style: "${sqStyle}"`);
  if (sqColor && sqColor !== dotColor) sqParts.push(`color: "${sqColor}"`);
  const dotCornerParts: string[] = [];
  if (dotSt !== "square") dotCornerParts.push(`style: "${dotSt}"`);
  if (dotDotColor && dotDotColor !== dotColor)
    dotCornerParts.push(`color: "${dotDotColor}"`);
  if (sqParts.length || dotCornerParts.length) {
    const cornerLines: string[] = [];
    if (sqParts.length)
      cornerLines.push(`    square: { ${sqParts.join(", ")} }`);
    if (dotCornerParts.length)
      cornerLines.push(`    dot: { ${dotCornerParts.join(", ")} }`);
    snippetParts.push(`  corner={{\n${cornerLines.join(",\n")},\n  }}`);
  }

  const qrParts: string[] = [];
  if (ecl) qrParts.push(`errorCorrectionLevel: "${ecl}"`);
  if (qrVersion !== "") qrParts.push(`version: ${qrVersion}`);
  if (qrParts.length) snippetParts.push(`  qr={{ ${qrParts.join(", ")} }}`);

  if (logoUrl) {
    const logoSrcSnippet = logoFileName
      ? `/* ${logoFileName} — replace with a URL */`
      : `"${logoUrl}"`;
    const logoParts = [`src: ${logoSrcSnippet}`];
    if (logoSize !== "") logoParts.push(`size: ${logoSize}`);
    if (logoMargin !== "") logoParts.push(`margin: ${logoMargin}`);
    if (!logoHideDots) logoParts.push(`hideDots: false`);
    snippetParts.push(`  logo={{\n    ${logoParts.join(",\n    ")},\n  }}`);
  }

  const snippet = `<QRCode\n${snippetParts.join("\n")}\n/>`;

  useEffect(() => {
    if (!codeOpen) return;
    let cancelled = false;
    getHighlighter().then((hl) => {
      if (cancelled) return;
      const { tokens: t, rootStyle } = hl.codeToTokens(snippet, {
        lang: "tsx",
        themes: { light: "github-light", dark: "github-dark" },
        defaultColor: false,
      });
      setTokens(t);
      if (rootStyle) {
        const style: Record<string, string> = {};
        for (const part of rootStyle.split(";")) {
          const i = part.indexOf(":");
          if (i !== -1)
            style[part.slice(0, i).trim()] = part.slice(i + 1).trim();
        }
        setPreStyle(style as CSSProperties);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [snippet, codeOpen]);

  return (
    <div className={s.root}>
      <div className={s.left}>
        <div className={s.preview} ref={previewRef}>
          {qrError ? (
            <span className={s.qrError}>{qrError}</span>
          ) : (
            <QRCode {...buildProps()} size={previewSize} />
          )}
          <div className={s.previewActions}>
            <SplitButton
              label="Copy"
              icon={<IoCopyOutline size={14} />}
              onMain={() => handleCopy("svg")}
              onOption={handleCopy}
            />
            <SplitButton
              label="Download"
              icon={<IoDownloadOutline size={14} />}
              onMain={() => handleDownload("svg")}
              onOption={handleDownload}
            />
          </div>
          {exportError && (
            <span className={s.qrError} role="alert">
              {exportError}
            </span>
          )}
        </div>
        <div className={s.snippetWrap}>
          <div className={s.snippetToolbar}>
            <button
              type="button"
              className={s.snippetToggle}
              onClick={() => setCodeOpen((o) => !o)}
              aria-expanded={codeOpen}
            >
              <IoChevronDown
                className={`${s.chevron} ${codeOpen ? s.chevronOpen : ""}`}
              />
              <span className={s.snippetLabel}>React code</span>
              <span className={s.snippetLang}>tsx</span>
            </button>
            <CopyButton text={snippet} />
          </div>
          {codeOpen && (
            <pre className={s.snippet} style={preStyle}>
              {tokens
                ? tokens.map((line, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: token lines are positional, never reorder
                    <span key={i}>
                      {line.map((token) => (
                        <span key={token.offset} style={tokenStyle(token)}>
                          {token.content}
                        </span>
                      ))}
                      {"\n"}
                    </span>
                  ))
                : snippet}
            </pre>
          )}
        </div>
      </div>

      <div className={s.controls}>
        <div className={s.valueBlock}>
          <Field label="Text or link">
            <div className={s.colorRow}>
              <input
                className={`${s.input} ${s.inputText}`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter text, link, email…"
              />
              {value && (
                <button
                  type="button"
                  className={s.clearBtn}
                  onClick={() => setValue("")}
                  title="Clear"
                  aria-label="Clear"
                >
                  <IoClose />
                </button>
              )}
            </div>
          </Field>
        </div>

        <div className={s.presets}>
          <span className={s.presetsLabel}>Pick a quick style</span>
          <div className={s.presetsRow}>
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                className={s.presetChip}
                onClick={() => applyPreset(p)}
                aria-label={`Apply ${p.name} style`}
              >
                <span className={s.presetThumb}>
                  <PresetThumb p={p} />
                </span>
                <span className={s.presetName}>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={s.tabBar} role="tablist">
          {(["Style", "Color", "Logo", "Advanced"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              className={`${s.tabBtn} ${tab === t ? s.tabBtnActive : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className={s.tabPanel}>
          {tab === "Style" && (
            <>
              <Field label="Dot style">
                <ShapePicker
                  options={["square", "rounded", "circle"] as DotStyle[]}
                  value={dotStyle}
                  onChange={(v) => {
                    trackEvent("dot_style_change", { value: v });
                    setDotStyle(v);
                  }}
                  renderIcon={dotShapeIcon}
                />
              </Field>
              <Field label="Corners style">
                <ShapePicker
                  options={
                    [
                      "square",
                      "rounded",
                      "extra-rounded",
                      "circle",
                    ] as CornerSquareStyle[]
                  }
                  value={sqStyle}
                  onChange={(v) => {
                    trackEvent("corner_square_style_change", { value: v });
                    setSqStyle(v);
                  }}
                  renderIcon={cornerSquareIcon}
                />
              </Field>
              <Field label="Corner dot style">
                <ShapePicker
                  options={["square", "rounded", "circle"] as CornerDotStyle[]}
                  value={dotSt}
                  onChange={(v) => {
                    trackEvent("corner_dot_style_change", { value: v });
                    setDotSt(v);
                  }}
                  renderIcon={cornerDotIcon}
                />
              </Field>
            </>
          )}

          {tab === "Color" && (
            <>
              <Field label="Dot color">
                <ColorControl
                  label="Dot color"
                  value={dotColor}
                  onChange={setDotColor}
                  defaultValue="#000000"
                />
              </Field>
              <Field label="Background">
                <ColorControl
                  label="Background"
                  value={bgColor}
                  onChange={setBgColor}
                  defaultValue="#ffffff"
                  transparent
                />
              </Field>
              <Field label="Corners color">
                <ColorControl
                  label="Corners color"
                  value={sqColor}
                  onChange={setSqColor}
                  nullable
                  fallback={dotColor}
                />
              </Field>
              <Field label="Corner dot color">
                <ColorControl
                  label="Corner dot color"
                  value={dotDotColor}
                  onChange={setDotDotColor}
                  nullable
                  fallback={dotColor}
                />
              </Field>
            </>
          )}

          {tab === "Logo" && (
            <>
              <Field label="Center logo">
                <div className={s.colorRow}>
                  {logoFileName ? (
                    <span
                      className={`${s.input} ${s.logoFileName}`}
                      title={logoFileName}
                    >
                      {logoFileName}
                    </span>
                  ) : (
                    <input
                      className={s.input}
                      value={logoUrl}
                      onChange={(e) => {
                        if (!logoUrl && e.target.value)
                          trackEvent("logo_added", { method: "url" });
                        setLogoUrl(e.target.value);
                        setLogoFileName(null);
                      }}
                      placeholder="https://example.com/logo.png"
                    />
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className={s.fileInput}
                    onChange={handleLogoFileUpload}
                  />
                  <button
                    type="button"
                    className={s.clearBtn}
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload local image"
                    aria-label="Upload local image"
                  >
                    <IoCloudUploadOutline size={12} />
                  </button>
                  {logoUrl && (
                    <button
                      type="button"
                      className={s.clearBtn}
                      onClick={clearLogoUrl}
                      title="Clear"
                      aria-label="Clear"
                    >
                      <IoClose />
                    </button>
                  )}
                </div>
              </Field>
              <div className={s.row2}>
                <Field label="Logo size (0–1)">
                  <div className={s.colorRow}>
                    <input
                      type="number"
                      className={s.input}
                      value={logoSize}
                      onKeyDown={(e) => {
                        if (
                          (e.key === "ArrowUp" || e.key === "ArrowDown") &&
                          logoSize === ""
                        ) {
                          e.preventDefault();
                          setLogoSize(0.4);
                        }
                      }}
                      onChange={(e) =>
                        setLogoSize(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      min={0}
                      max={1}
                      step={0.01}
                      placeholder="auto"
                    />
                    {logoSize !== "" && (
                      <button
                        type="button"
                        className={s.clearBtn}
                        onClick={() => setLogoSize("")}
                        title="Reset to auto"
                        aria-label="Reset to auto"
                      >
                        <IoClose />
                      </button>
                    )}
                  </div>
                </Field>
                <Field label="Logo margin">
                  <div className={s.colorRow}>
                    <input
                      type="number"
                      className={s.input}
                      value={logoMargin}
                      onChange={(e) =>
                        setLogoMargin(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      min={0}
                      placeholder="0"
                    />
                    {logoMargin !== "" && (
                      <button
                        type="button"
                        className={s.clearBtn}
                        onClick={() => setLogoMargin("")}
                        title="Reset to auto"
                        aria-label="Reset to auto"
                      >
                        <IoClose />
                      </button>
                    )}
                  </div>
                </Field>
              </div>
              <Field label="Clear dots behind logo">
                <label className={s.toggle}>
                  <input
                    type="checkbox"
                    checked={logoHideDots}
                    onChange={(e) => setLogoHideDots(e.target.checked)}
                  />
                  <span className={s.toggleTrack}>
                    <span className={s.toggleThumb} />
                  </span>
                  <span className={s.toggleLabel}>
                    recommended for readability
                  </span>
                </label>
              </Field>
            </>
          )}

          {tab === "Advanced" && (
            <>
              <div className={s.row2}>
                <Field label="Size (px)">
                  <NumberInput
                    value={size}
                    onChange={setSize}
                    min={64}
                    max={2048}
                  />
                </Field>
                <Field label="Margin">
                  <NumberInput
                    value={margin}
                    onChange={setMargin}
                    min={0}
                    max={20}
                  />
                </Field>
              </div>
              <Field label="Error correction">
                <Tabs
                  options={["auto", "L", "M", "Q", "H"]}
                  value={ecl || "auto"}
                  onChange={(v) => {
                    const next = v === "auto" ? "" : (v as ECL);
                    trackEvent("ecl_change", { value: v });
                    setEcl(next);
                  }}
                />
              </Field>
              <Field label="QR version (1–40, blank = auto)">
                <div className={s.colorRow}>
                  <input
                    type="number"
                    className={s.input}
                    value={qrVersion}
                    onChange={(e) =>
                      setQrVersion(
                        e.target.value === ""
                          ? ""
                          : Math.min(40, Math.max(1, Number(e.target.value))),
                      )
                    }
                    min={1}
                    max={40}
                    placeholder="auto"
                  />
                  {qrVersion !== "" && (
                    <button
                      type="button"
                      className={s.clearBtn}
                      onClick={() => setQrVersion("")}
                      title="Reset to auto"
                      aria-label="Reset to auto"
                    >
                      <IoClose />
                    </button>
                  )}
                </div>
              </Field>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={s.field}>
      <span className={s.label}>{label}</span>
      {children}
    </div>
  );
}

function Tabs<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className={s.tabs}>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          className={`${s.tab} ${value === o ? s.tabActive : ""}`}
          onClick={() => onChange(o)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

// ─── Visual shape picker ──────────────────────────────────────────────────────

const ICON_SIZE = 36;

function ShapeSvg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={ICON_SIZE}
      height={ICON_SIZE}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// Dot style: a mini QR module pattern drawn in the chosen shape
const DOT_CELLS: [number, number][] = [
  [0, 0],
  [1, 0],
  [3, 0],
  [0, 1],
  [3, 1],
  [1, 2],
  [2, 2],
  [0, 3],
  [2, 3],
  [3, 3],
];

function dotShapeIcon(style: string) {
  const m = 3.8;
  return (
    <>
      {DOT_CELLS.map(([c, r]) => {
        const x = 3 + c * 5;
        const y = 3 + r * 5;
        if (style === "circle")
          return (
            <circle
              key={`${c}-${r}`}
              cx={x + m / 2}
              cy={y + m / 2}
              r={m / 2}
              fill="currentColor"
            />
          );
        return (
          <rect
            key={`${c}-${r}`}
            x={x}
            y={y}
            width={m}
            height={m}
            rx={style === "rounded" ? 1.4 : 0}
            fill="currentColor"
          />
        );
      })}
    </>
  );
}

// The finder-pattern outer ring in the chosen shape
function finderRing(style: string, extra?: Record<string, unknown>) {
  const ring = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    ...extra,
  };
  if (style === "circle") return <circle cx="12" cy="12" r="8" {...ring} />;
  if (style === "extra-rounded")
    return <rect x="4" y="4" width="16" height="16" rx="6" {...ring} />;
  if (style === "rounded")
    return <rect x="4" y="4" width="16" height="16" rx="3" {...ring} />;
  return <rect x="4" y="4" width="16" height="16" {...ring} />;
}

// The finder-pattern center block in the chosen shape
function finderCenter(style: string, extra?: Record<string, unknown>) {
  const fill = { fill: "currentColor", ...extra };
  if (style === "circle") return <circle cx="12" cy="12" r="3.6" {...fill} />;
  return (
    <rect
      x="8.4"
      y="8.4"
      width="7.2"
      height="7.2"
      rx={style === "rounded" ? 2 : 0}
      {...fill}
    />
  );
}

// Corner frame: emphasize the ring, fade the center
function cornerSquareIcon(style: string) {
  return (
    <>
      {finderRing(style)}
      {finderCenter("rounded", { opacity: 0.2 })}
    </>
  );
}

// Corner dot: emphasize the center, fade the ring
function cornerDotIcon(style: string) {
  return (
    <>
      {finderRing("rounded", { opacity: 0.2 })}
      {finderCenter(style)}
    </>
  );
}

function ShapePicker<T extends string>({
  options,
  value,
  onChange,
  renderIcon,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  renderIcon: (o: T) => React.ReactNode;
}) {
  return (
    <div className={s.shapePicker}>
      {options.map((o) => (
        <div key={o} className={s.shapeItem}>
          <button
            type="button"
            className={`${s.shapeOption} ${value === o ? s.shapeOptionActive : ""}`}
            onClick={() => onChange(o)}
            aria-pressed={value === o}
            title={o}
          >
            <ShapeSvg>{renderIcon(o)}</ShapeSvg>
          </button>
          <span className={s.shapeName}>{o}</span>
        </div>
      ))}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
  placeholder,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  placeholder?: string;
}) {
  const [raw, setRaw] = useState(String(value));

  // Sync when the value prop changes from outside (e.g. a preset/reset),
  // but leave the field alone while the user is mid-edit
  useEffect(() => {
    setRaw((prev) => (Number(prev) === value ? prev : String(value)));
  }, [value]);

  const parsed = raw === "" ? Number.NaN : Number(raw);
  const tooSmall = !Number.isNaN(parsed) && min !== undefined && parsed < min;
  const tooBig = !Number.isNaN(parsed) && max !== undefined && parsed > max;
  const valid = !Number.isNaN(parsed) && !tooSmall && !tooBig;

  const errorMsg = tooSmall
    ? `Min ${min} in playground`
    : tooBig
      ? `Max ${max} in playground`
      : null;

  return (
    <div className={s.numberWrap}>
      <input
        type="number"
        className={`${s.input} ${valid ? "" : s.inputError}`}
        value={raw}
        onChange={(e) => {
          const next = e.target.value;
          setRaw(next);
          const n = Number(next);
          if (
            next !== "" &&
            !Number.isNaN(n) &&
            (min === undefined || n >= min) &&
            (max === undefined || n <= max)
          ) {
            onChange(n);
          }
        }}
        min={min}
        max={max}
        placeholder={placeholder}
      />
      {errorMsg && <span className={s.inputErrorMsg}>{errorMsg}</span>}
    </div>
  );
}

function ColorControl({
  label,
  value,
  onChange,
  defaultValue,
  transparent,
  nullable,
  fallback,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  defaultValue?: string;
  transparent?: boolean;
  nullable?: boolean;
  fallback?: string;
}) {
  const isDirty = defaultValue !== undefined && value !== defaultValue;

  if (nullable && !value) {
    return (
      <button
        type="button"
        className={s.addColorBtn}
        onClick={() => onChange(fallback ?? "#000000")}
      >
        <IoAdd />
        set custom color
      </button>
    );
  }

  if (value === "transparent") {
    return (
      <div className={s.colorRow}>
        <span className={s.transparentSwatch} aria-hidden="true" />
        <span className={s.transparentLabel}>transparent</span>
        <button
          type="button"
          className={s.clearBtn}
          onClick={() => defaultValue !== undefined && onChange(defaultValue)}
          title="Reset to default"
          aria-label="Reset to default"
        >
          <IoClose />
        </button>
      </div>
    );
  }

  return (
    <div className={s.colorRow}>
      <input
        type="color"
        className={s.swatch}
        value={HEX6.test(value) ? value : "#000000"}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label ? `${label} color picker` : "color picker"}
      />
      <input
        className={s.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={9}
        aria-label={label ? `${label} hex value` : "hex value"}
      />
      {nullable ? (
        <button
          type="button"
          className={s.clearBtn}
          onClick={() => onChange("")}
          title="Remove color"
          aria-label="Remove color"
        >
          <IoClose />
        </button>
      ) : isDirty && defaultValue !== undefined ? (
        <button
          type="button"
          className={s.clearBtn}
          onClick={() => onChange(defaultValue)}
          title="Reset to default"
          aria-label="Reset to default"
        >
          <IoClose />
        </button>
      ) : (
        transparent && (
          <button
            type="button"
            className={s.transparentBtn}
            onClick={() => onChange("transparent")}
          >
            transparent
          </button>
        )
      )}
    </div>
  );
}

function SplitButton({
  label,
  icon,
  onMain,
  onOption,
}: {
  label: string;
  icon: React.ReactNode;
  onMain: () => Promise<void>;
  onOption: (fmt: ExportFormat) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  async function run(action: () => Promise<void>) {
    try {
      await action();
    } catch {
      return; // error already surfaced by the caller
    }
    setDone(true);
    setTimeout(() => setDone(false), 1500);
  }

  const doneLabel = label === "Copy" ? "Copied!" : "Downloaded!";
  const mainLabel = done ? doneLabel : label;

  return (
    <div className={s.splitBtnWrap} ref={ref}>
      <button
        type="button"
        className={s.splitBtnMain}
        onClick={() => run(onMain)}
      >
        {icon}
        <span>{mainLabel}</span>
      </button>
      <button
        type="button"
        className={`${s.splitBtnArrow} ${open ? s.splitBtnArrowOpen : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={`${label} options`}
      >
        <IoChevronDown />
      </button>
      {open && (
        <div className={s.splitBtnDropdown}>
          {(["svg", "png", "jpg"] as ExportFormat[]).map((fmt) => (
            <button
              key={fmt}
              type="button"
              className={s.splitBtnOption}
              onClick={() => {
                setOpen(false);
                run(() => onOption(fmt));
              }}
            >
              {label} as {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
