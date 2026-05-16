"use client";

import type {
  CornerDotStyle,
  CornerSquareStyle,
  DotStyle,
} from "@ttsalpha/qrcode";
import { QRCode } from "@ttsalpha/qrcode";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { createHighlighter, type Highlighter, type ThemedToken } from "shiki";
import CopyButton from "./CopyButton";
import s from "./Playground.module.css";

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
  const [logoSize, setLogoSize] = useState<number | "">("");
  const [logoMargin, setLogoMargin] = useState<number | "">("");

  const [tokens, setTokens] = useState<ThemedToken[][] | null>(null);
  const [preStyle, setPreStyle] = useState<CSSProperties>({});

  const previewRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState(256);
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
    const logoParts = [`src: "${logoUrl}"`];
    if (logoSize !== "") logoParts.push(`size: ${logoSize}`);
    if (logoMargin !== "") logoParts.push(`margin: ${logoMargin}`);
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
          <QRErrorBoundary resetKey={snippet}>
            <QRCode
              value={value || "https://example.com"}
              size={previewSize}
              margin={margin}
              dotStyle={dotStyle}
              dotColor={dotColor}
              backgroundColor={bgColor}
              corner={{
                square: { style: sqStyle, color: sqColor || undefined },
                dot: { style: dotSt, color: dotDotColor || undefined },
              }}
              qr={{
                errorCorrectionLevel: ecl,
                version: qrVersion !== "" ? (qrVersion as number) : undefined,
              }}
              logo={
                logoUrl
                  ? {
                      src: logoUrl,
                      size: logoSize !== "" ? (logoSize as number) : undefined,
                      margin:
                        logoMargin !== "" ? (logoMargin as number) : undefined,
                    }
                  : undefined
              }
            />
          </QRErrorBoundary>
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
            <input
              className={s.input}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="https://example.com"
            />
          </Field>
        </Group>

        <Group title="Appearance" defaultOpen>
          <Field label="dotStyle">
            <Tabs
              options={["square", "circle", "rounded"] as DotStyle[]}
              value={dotStyle}
              onChange={setDotStyle}
            />
          </Field>
          <Field label="dotColor">
            <ColorInput
              value={dotColor}
              onChange={setDotColor}
              defaultValue="#000000"
            />
          </Field>
          <Field label="backgroundColor">
            <ColorInput
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
              onChange={setSqStyle}
            />
          </Field>
          <Field label="corner.square.color">
            <NullableColorInput
              value={sqColor}
              onChange={setSqColor}
              fallback={dotColor}
            />
          </Field>
          <Field label="corner.dot.style">
            <Tabs
              options={["square", "rounded", "circle"] as CornerDotStyle[]}
              value={dotSt}
              onChange={setDotSt}
            />
          </Field>
          <Field label="corner.dot.color">
            <NullableColorInput
              value={dotDotColor}
              onChange={setDotDotColor}
              fallback={dotColor}
            />
          </Field>
        </Group>

        <Group title="QR Settings">
          <Field label="errorCorrectionLevel">
            <Tabs
              options={["L", "M", "Q", "H"] as ECL[]}
              value={ecl}
              onChange={setEcl}
            />
          </Field>
          <Field label="version — 1–40, blank = auto">
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
                  <CrossIcon />
                </button>
              )}
            </div>
          </Field>
        </Group>

        <Group title="Dimensions">
          <div className={s.row3}>
            <Field label="size">
              <NumberInput value={size} onChange={setSize} min={64} max={300} />
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
              <input
                className={s.input}
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
              />
              {logoUrl && (
                <button
                  type="button"
                  className={s.clearBtn}
                  onClick={() => setLogoUrl("")}
                  title="Clear"
                  aria-label="Clear"
                >
                  <CrossIcon />
                </button>
              )}
            </div>
          </Field>
          <div className={s.row2}>
            <Field label="size (0-1)">
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
                  step={0.05}
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
                    <CrossIcon />
                  </button>
                )}
              </div>
            </Field>
            <Field label="margin">
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
            </Field>
          </div>
        </Group>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

import { Component, type ReactNode } from "react";

class QRErrorBoundary extends Component<
  { children: ReactNode; resetKey: unknown },
  { error: string | null }
> {
  state = { error: null };

  static getDerivedStateFromError(err: unknown) {
    return { error: err instanceof Error ? err.message : String(err) };
  }

  componentDidUpdate(prev: { resetKey: unknown }) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return <span className={s.qrError}>{this.state.error}</span>;
    }
    return this.props.children;
  }
}

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
        <ChevronIcon className={`${s.chevron} ${open ? s.chevronOpen : ""}`} />
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
  value,
  onChange,
  defaultValue,
  transparent,
}: {
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
          <CrossIcon />
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
      />
      <input
        className={s.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={9}
      />
      {isDirty ? (
        <button
          type="button"
          className={s.clearBtn}
          onClick={() => defaultValue !== undefined && onChange(defaultValue)}
          title="Reset to default"
          aria-label="Reset to default"
        >
          <CrossIcon />
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
  value,
  onChange,
  fallback,
}: {
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
        <PlusIcon />
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
      />
      <input
        className={s.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={9}
      />
      <button
        type="button"
        className={s.clearBtn}
        onClick={() => onChange("")}
        title="Reset to default"
        aria-label="Reset to default"
      >
        <CrossIcon />
      </button>
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 5l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 2v8M2 6h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 2l8 8M10 2l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
