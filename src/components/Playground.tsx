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
import { useEffect, useMemo, useRef, useState } from "react";
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

type ECL = "L" | "M" | "Q" | "H";

export default function Playground() {
  // Content
  const [value, setValue] = useState("https://github.com/ttsalpha/qrcode");

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
  const [ecl, setEcl] = useState<ECL>("M");
  const [qrVersion, setQrVersion] = useState<number | "">("");

  // Logo
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFileName, setLogoFileName] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState<number | "">("");
  const [logoMargin, setLogoMargin] = useState<number | "">("");
  const [logoHideDots, setLogoHideDots] = useState(true);

  const hasInteracted = useRef(false);
  function trackEvent(name: string, props?: Record<string, string>) {
    if (!hasInteracted.current) {
      hasInteracted.current = true;
      track("playground_first_interact");
    }
    track(name, props);
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
      value: value || "https://example.com",
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
        errorCorrectionLevel: ecl,
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
  }

  async function handleDownload(fmt: ExportFormat) {
    trackEvent("export_download", { format: fmt });
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
        value: value || "https://example.com",
        qr: { errorCorrectionLevel: ecl, version: qrVersion as number },
      });
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : String(e);
    }
  }, [value, ecl, qrVersion]);

  // Build snippet — only non-default values
  const snippetParts: string[] = [`  value="${value}"`];
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
  if (ecl !== "M") qrParts.push(`errorCorrectionLevel: "${ecl}"`);
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
  }, [snippet]);

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
        </div>
        <div className={s.snippetWrap}>
          <div className={s.snippetToolbar}>
            <span className={s.snippetLang}>tsx</span>
            <CopyButton text={snippet} />
          </div>
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
        </div>
      </div>

      <div className={s.controls}>
        <Group title="Content" defaultOpen>
          <Field label="value">
            <div className={s.colorRow}>
              <input
                className={s.input}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="https://example.com"
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
        </Group>

        <Group title="Appearance" defaultOpen>
          <Field label="dotStyle">
            <Tabs
              options={["square", "rounded", "circle"] as DotStyle[]}
              value={dotStyle}
              onChange={(v) => {
                trackEvent("dot_style_change", { value: v });
                setDotStyle(v);
              }}
            />
          </Field>
          <Field label="dotColor">
            <ColorInput
              label="dotColor"
              value={dotColor}
              onChange={setDotColor}
              defaultValue="#000000"
            />
          </Field>
          <Field label="backgroundColor">
            <ColorInput
              label="backgroundColor"
              value={bgColor}
              onChange={setBgColor}
              defaultValue="#ffffff"
              transparent
            />
          </Field>
        </Group>

        <Group title="Corners" defaultOpen>
          <Field label="corner.square.style">
            <Tabs
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
            />
          </Field>
          <Field label="corner.square.color">
            <NullableColorInput
              label="corner.square.color"
              value={sqColor}
              onChange={setSqColor}
              fallback={dotColor}
            />
          </Field>
          <Field label="corner.dot.style">
            <Tabs
              options={["square", "rounded", "circle"] as CornerDotStyle[]}
              value={dotSt}
              onChange={(v) => {
                trackEvent("corner_dot_style_change", { value: v });
                setDotSt(v);
              }}
            />
          </Field>
          <Field label="corner.dot.color">
            <NullableColorInput
              label="corner.dot.color"
              value={dotDotColor}
              onChange={setDotDotColor}
              fallback={dotColor}
            />
          </Field>
        </Group>

        <Group title="QR Settings">
          <Field label="qr.errorCorrectionLevel">
            <Tabs
              options={["L", "M", "Q", "H"] as ECL[]}
              value={ecl}
              onChange={(v) => {
                trackEvent("ecl_change", { value: v });
                setEcl(v);
              }}
            />
          </Field>
          <Field label="qr.version (1–40, blank = auto)">
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
        </Group>

        <Group title="Dimensions">
          <div className={s.row2}>
            <Field label="size">
              <NumberInput
                value={size}
                onChange={setSize}
                min={64}
                max={2048}
              />
            </Field>
            <Field label="margin">
              <NumberInput
                value={margin}
                onChange={setMargin}
                min={0}
                max={20}
              />
            </Field>
          </div>
        </Group>

        <Group title="Logo">
          <Field label="logo.src">
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
            <Field label="logo.size">
              <div className={s.colorRow}>
                <input
                  type="number"
                  className={s.input}
                  value={logoSize}
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
            <Field label="logo.margin">
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
          <Field label="logo.hideDots">
            <label className={s.toggle}>
              <input
                type="checkbox"
                checked={logoHideDots}
                onChange={(e) => setLogoHideDots(e.target.checked)}
              />
              <span className={s.toggleTrack}>
                <span className={s.toggleThumb} />
              </span>
              <span className={s.toggleLabel}>clear dots behind logo</span>
            </label>
          </Field>
        </Group>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Group({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={s.group}>
      <button
        type="button"
        className={s.groupHeader}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className={s.groupTitle}>{title}</span>
        <IoChevronDown
          className={`${s.chevron} ${open ? s.chevronOpen : ""}`}
        />
      </button>
      {open && <div className={s.groupBody}>{children}</div>}
    </div>
  );
}

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

function ColorInput({
  label,
  value,
  onChange,
  defaultValue,
  transparent,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  defaultValue?: string;
  transparent?: boolean;
}) {
  const isDirty = defaultValue !== undefined && value !== defaultValue;

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
        value={value}
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
      {isDirty ? (
        <button
          type="button"
          className={s.clearBtn}
          onClick={() => defaultValue !== undefined && onChange(defaultValue)}
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

function NullableColorInput({
  label,
  value,
  onChange,
  fallback,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  fallback: string;
}) {
  if (!value) {
    return (
      <button
        type="button"
        className={s.addColorBtn}
        onClick={() => onChange(fallback)}
      >
        <IoAdd />
        set custom color
      </button>
    );
  }
  return (
    <div className={s.colorRow}>
      <input
        type="color"
        className={s.swatch}
        value={value}
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
      <button
        type="button"
        className={s.clearBtn}
        onClick={() => onChange("")}
        title="Reset to default"
        aria-label="Reset to default"
      >
        <IoClose />
      </button>
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
    await action();
    if (label === "Copy") {
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    }
  }

  return (
    <div className={s.splitBtnWrap} ref={ref}>
      <button
        type="button"
        className={s.splitBtnMain}
        onClick={() => run(onMain)}
      >
        {icon}
        <span>{done ? "Copied!" : label}</span>
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
