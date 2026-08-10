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
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  IoAdd,
  IoCheckmark,
  IoChevronDown,
  IoClose,
  IoCloudUploadOutline,
  IoCopyOutline,
  IoDownloadOutline,
  IoHelpCircleOutline,
  IoLinkOutline,
} from "react-icons/io5";
import { createHighlighter, type Highlighter, type ThemedToken } from "shiki";
import { buildQRUrl, HEX6 } from "@/lib/qr-params";
import CopyButton from "./CopyButton";
import s from "./Playground.module.css";

type ExportFormat = "svg" | "png" | "jpg";

type SplitOption = { key: string; label: string };

const FORMAT_OPTIONS: SplitOption[] = [
  { key: "png", label: "PNG" },
  { key: "jpg", label: "JPG" },
  { key: "svg", label: "SVG" },
];

const LINK_OPTIONS: SplitOption[] = [
  { key: "png", label: "PNG link" },
  { key: "jpg", label: "JPG link" },
  { key: "svg", label: "SVG link" },
  { key: "html", label: "HTML <img>" },
  { key: "markdown", label: "Markdown" },
];

// Shown when the input is empty — the field starts blank (placeholder visible)
// but the QR still encodes this so the preview is never empty
const DEFAULT_VALUE = "https://github.com/ttsalpha/qrcode";

// A logo URL the /qr route can fetch, as opposed to an uploaded data: URL
const HTTP_URL = /^https?:\/\/.+/i;

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
    dotColor: "#000000",
    bgColor: "#ffffff",
    sqStyle: "extra-rounded",
    sqColor: "",
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
    name: "Teal",
    dotStyle: "rounded",
    dotColor: "#000000",
    bgColor: "#ffffff",
    sqStyle: "extra-rounded",
    sqColor: "#14b8a6",
    dotSt: "rounded",
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
  {
    name: "Forest",
    dotStyle: "rounded",
    dotColor: "#15803d",
    bgColor: "#ffffff",
    sqStyle: "extra-rounded",
    sqColor: "#22c55e",
    dotSt: "rounded",
    dotDotColor: "#15803d",
  },
  {
    name: "Indigo",
    dotStyle: "square",
    dotColor: "#3730a3",
    bgColor: "#ffffff",
    sqStyle: "rounded",
    sqColor: "#6366f1",
    dotSt: "square",
    dotDotColor: "#3730a3",
  },
  {
    name: "Grape",
    dotStyle: "circle",
    dotColor: "#86198f",
    bgColor: "#ffffff",
    sqStyle: "extra-rounded",
    sqColor: "#d946ef",
    dotSt: "circle",
    dotDotColor: "#86198f",
  },
];

// Chip swatch: frame = corner square color + style, fill = dot color + style
const SQ_RADIUS: Record<CornerSquareStyle, string> = {
  square: "2px",
  rounded: "4px",
  "extra-rounded": "6px",
  circle: "50%",
};

const DOT_RADIUS: Record<DotStyle, string> = {
  square: "1px",
  rounded: "2px",
  circle: "50%",
};

export default function Playground() {
  // Content
  const [value, setValue] = useState("");

  // Appearance
  const [dotStyle, setDotStyle] = useState<DotStyle>("rounded");
  const [dotColor, setDotColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  // Dimensions
  const [size, setSize] = useState(512);
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
  // Reports that the user engaged, never anything about what they typed
  function markInteracted() {
    if (hasInteracted.current) return;
    hasInteracted.current = true;
    track("playground_first_interact");
  }

  function trackEvent(name: string, props?: Record<string, string>) {
    markInteracted();
    track(name, props);
  }

  // Shared by all three shape pickers; re-picking the active shape is no change
  function trackStyleChange(field: string, value: string, prev: string) {
    if (value === prev) return;
    trackEvent("style_change", { field, value });
  }

  // input[type=color] fires all through a drag, so wait for 500ms of quiet
  const colorTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  function trackColorChange(field: string) {
    const timers = colorTimers.current;
    if (timers[field]) clearTimeout(timers[field]);
    timers[field] = setTimeout(() => {
      delete timers[field];
      trackEvent("color_change", { field });
    }, 500);
  }

  function applyPreset(p: Preset) {
    if (!isPresetActive(p)) trackEvent("preset_apply", { name: p.name });
    setDotStyle(p.dotStyle);
    setDotColor(p.dotColor);
    setBgColor(p.bgColor);
    setSqStyle(p.sqStyle);
    setSqColor(p.sqColor);
    setDotSt(p.dotSt);
    setDotDotColor(p.dotDotColor);
  }

  function isPresetActive(p: Preset) {
    return (
      dotStyle === p.dotStyle &&
      dotColor === p.dotColor &&
      bgColor === p.bgColor &&
      sqStyle === p.sqStyle &&
      sqColor === p.sqColor &&
      dotSt === p.dotSt &&
      dotDotColor === p.dotDotColor
    );
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

  // The export_* events fire after the work lands, so each one is a real export
  async function handleCopy(fmt: ExportFormat) {
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
      flashError("Couldn't copy. Check the logo URL or clipboard access.");
      throw new Error("copy failed");
    }
    trackEvent("export_copy", { format: fmt });
  }

  async function handleDownload(fmt: ExportFormat) {
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
      flashError("Couldn't export. Check the logo URL.");
      throw new Error("download failed");
    }
    trackEvent("export_download", { format: fmt });
  }

  // Copy a /qr link that renders the current QR. Uploaded data:/blob: logos
  // don't fit in a URL — buildQRUrl drops them, so warn.
  async function handleCopyUrl(key: string) {
    const origin = window.location.origin;
    const props = buildProps();
    let text: string;
    if (key === "html") {
      text = `<img src="${buildQRUrl(props, "svg", origin)}" alt="QR code" />`;
    } else if (key === "markdown") {
      text = `![QR code](${buildQRUrl(props, "svg", origin)})`;
    } else {
      text = buildQRUrl(props, key as ExportFormat, origin);
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      flashError("Couldn't copy the link. Check clipboard access.");
      throw new Error("copy failed");
    }
    trackEvent("export_copy_url", { format: key });
    if (logoUrl && !HTTP_URL.test(logoUrl)) {
      flashError("Uploaded logo can't go in a link. Use a logo URL instead.");
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
      ? `/* ${logoFileName}, replace with a URL */`
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
        </div>
        <div className={s.previewActions}>
          <SplitButton
            label="Download"
            icon={<IoDownloadOutline size={14} />}
            onMain={() => handleDownload("png")}
            onOption={(k) => handleDownload(k as ExportFormat)}
            primary
          />
          <SplitButton
            label="Copy image"
            icon={<IoCopyOutline size={14} />}
            onMain={() => handleCopy("png")}
            onOption={(k) => handleCopy(k as ExportFormat)}
          />
          <SplitButton
            label="Copy link"
            icon={<IoLinkOutline size={14} />}
            onMain={() => handleCopyUrl("png")}
            onOption={handleCopyUrl}
            options={LINK_OPTIONS}
          />
        </div>
        {exportError && (
          <span className={s.qrError} role="alert">
            {exportError}
          </span>
        )}
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
            </button>
            <CopyButton text={snippet} eventName="snippet_copy" />
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
                onChange={(e) => {
                  markInteracted();
                  setValue(e.target.value);
                }}
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
            {PRESETS.map((p) => {
              const active = isPresetActive(p);
              return (
                <button
                  key={p.name}
                  type="button"
                  className={`${s.presetChip} ${active ? s.presetChipActive : ""}`}
                  onClick={() => applyPreset(p)}
                  aria-pressed={active}
                  aria-label={`Apply ${p.name} style`}
                >
                  <span
                    className={s.presetSwatch}
                    style={{
                      background: p.bgColor,
                      borderColor: p.sqColor || p.dotColor,
                      borderRadius: SQ_RADIUS[p.sqStyle],
                    }}
                  >
                    <span
                      className={s.presetSwatchDot}
                      style={{
                        background: p.dotColor,
                        borderRadius: DOT_RADIUS[p.dotStyle],
                      }}
                    />
                  </span>
                  {p.name}
                </button>
              );
            })}
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
                    trackStyleChange("dot", v, dotStyle);
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
                    trackStyleChange("corner_square", v, sqStyle);
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
                    trackStyleChange("corner_dot", v, dotSt);
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
                  onChange={(v) => {
                    trackColorChange("dot");
                    setDotColor(v);
                  }}
                  defaultValue="#000000"
                />
              </Field>
              <Field label="Background">
                <ColorControl
                  label="Background"
                  value={bgColor}
                  onChange={(v) => {
                    trackColorChange("background");
                    setBgColor(v);
                  }}
                  defaultValue="#ffffff"
                  transparent
                />
              </Field>
              <Field label="Corners color">
                <ColorControl
                  label="Corners color"
                  value={sqColor}
                  onChange={(v) => {
                    trackColorChange("corner_square");
                    setSqColor(v);
                  }}
                  nullable
                  fallback={dotColor}
                />
              </Field>
              <Field label="Corner dot color">
                <ColorControl
                  label="Corner dot color"
                  value={dotDotColor}
                  onChange={(v) => {
                    trackColorChange("corner_dot");
                    setDotDotColor(v);
                  }}
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
                        const next = e.target.value;
                        // Count once the URL is usable, not on keystroke one
                        if (!HTTP_URL.test(logoUrl) && HTTP_URL.test(next))
                          trackEvent("logo_added", { method: "url" });
                        setLogoUrl(next);
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
              <Field
                label="Error correction"
                hint="Spare data that lets a scanner read the code even when part of it is dirty, scratched, or covered by a logo. Higher levels survive more damage but make each dot smaller. Auto uses M, and raises it on its own when you add a logo."
              >
                <Tabs
                  options={["auto", "L", "M", "Q", "H"]}
                  value={ecl || "auto"}
                  onChange={(v) => {
                    const next = v === "auto" ? "" : (v as ECL);
                    if (next !== ecl) trackEvent("ecl_change", { value: v });
                    setEcl(next);
                  }}
                />
              </Field>
              <Field
                label="QR version"
                hint="How big the dot grid is: version 1 is 21×21 dots, version 40 is 177×177. Higher versions hold more characters. Leave it blank and the smallest version that fits your content gets picked."
              >
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
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  const hintId = `${label.replace(/\W+/g, "-").toLowerCase()}-hint`;
  return (
    <div className={s.field}>
      <span className={s.labelRow}>
        <span className={s.label}>{label}</span>
        {hint && (
          <span className={s.hintWrap}>
            <button
              type="button"
              className={s.hintBtn}
              aria-describedby={hintId}
              aria-label={`What is ${label}?`}
            >
              <IoHelpCircleOutline size={15} />
            </button>
            <span role="tooltip" id={hintId} className={s.hintTip}>
              {hint}
            </span>
          </span>
        )}
      </span>
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
  options,
  primary,
}: {
  label: string;
  icon: React.ReactNode;
  onMain: () => Promise<void>;
  onOption: (key: string) => Promise<void>;
  options?: SplitOption[];
  primary?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Flip above the button when the menu would run past the viewport. Layout
  // effect so the direction settles before paint.
  useLayoutEffect(() => {
    if (!open) return;
    const anchor = ref.current?.getBoundingClientRect();
    const height = menuRef.current?.offsetHeight ?? 0;
    if (!anchor) return;
    const below = window.innerHeight - anchor.bottom;
    setDropUp(below < height + 12 && anchor.top > below);
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

  const doneLabel = label.startsWith("Copy") ? "Copied!" : "Saved!";
  const mainLabel = done ? doneLabel : label;

  return (
    <div
      className={`${s.splitBtnWrap} ${primary ? s.splitBtnWrapPrimary : ""}`}
      ref={ref}
    >
      <button
        type="button"
        className={`${s.splitBtnMain} ${done ? s.splitBtnMainDone : ""}`}
        onClick={() => run(onMain)}
      >
        {done ? <IoCheckmark size={15} /> : icon}
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
        <div
          ref={menuRef}
          className={`${s.splitBtnDropdown} ${dropUp ? s.splitBtnDropdownUp : ""}`}
        >
          {(options ?? FORMAT_OPTIONS).map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={s.splitBtnOption}
              onClick={() => {
                setOpen(false);
                run(() => onOption(opt.key));
              }}
            >
              {options ? opt.label : `${label} as ${opt.label}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
