"use client";

import type {
  CornerDotStyle,
  CornerSquareStyle,
  DotStyle,
} from "@ttsalpha/qrcode";
import { QRCode } from "@ttsalpha/qrcode";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
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
  const [value, setValue] = useState("https://github.com/ttsalpha/qrcode");
  const [dotStyle, setDotStyle] = useState<DotStyle>("rounded");
  const [dotColor, setDotColor] = useState("#0d0d0d");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [sqStyle, setSqStyle] = useState<CornerSquareStyle>("extra-rounded");
  const [sqColor, setSqColor] = useState("#14b8a6");
  const [dotSt, setDotSt] = useState<CornerDotStyle>("rounded");
  const [ecl, setEcl] = useState<ECL>("M");
  const [logoUrl, setLogoUrl] = useState("");
  const [tokens, setTokens] = useState<ThemedToken[][] | null>(null);
  const [preStyle, setPreStyle] = useState<CSSProperties>({});

  const snippet = `<QRCode
  value="${value}"
  dotStyle="${dotStyle}"
  dotColor="${dotColor}"
  backgroundColor="${bgColor}"
  corner={{
    square: { style: "${sqStyle}", color: "${sqColor}" },
    dot: { style: "${dotSt}" },
  }}
  qr={{ errorCorrectionLevel: "${ecl}" }}${logoUrl ? `\n  logo={{ src: "${logoUrl}", padding: 6 }}` : ""}
/>`;

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
        <div className={s.preview}>
          <QRCode
            value={value || "https://example.com"}
            width={220}
            height={220}
            dotStyle={dotStyle}
            dotColor={dotColor}
            backgroundColor={bgColor}
            corner={{
              square: { style: sqStyle, color: sqColor },
              dot: { style: dotSt },
            }}
            qr={{ errorCorrectionLevel: ecl }}
            logo={logoUrl ? { src: logoUrl, padding: 6 } : undefined}
          />
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
        <Field label="value">
          <input
            className={s.input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://example.com"
          />
        </Field>

        <Field label="dotStyle">
          <Tabs
            options={["square", "circle", "rounded"] as DotStyle[]}
            value={dotStyle}
            onChange={setDotStyle}
          />
        </Field>

        <Field label="dotColor">
          <ColorInput value={dotColor} onChange={setDotColor} />
        </Field>

        <Field label="backgroundColor">
          <ColorInput value={bgColor} onChange={setBgColor} />
        </Field>

        <Field label="corner.square.style">
          <Tabs
            options={
              ["square", "rounded", "extra-rounded"] as CornerSquareStyle[]
            }
            value={sqStyle}
            onChange={setSqStyle}
          />
        </Field>

        <Field label="corner.square.color">
          <ColorInput value={sqColor} onChange={setSqColor} />
        </Field>

        <Field label="corner.dot.style">
          <Tabs
            options={["square", "rounded", "circle"] as CornerDotStyle[]}
            value={dotSt}
            onChange={setDotSt}
          />
        </Field>

        <Field label="errorCorrectionLevel">
          <Tabs
            options={["L", "M", "Q", "H"] as ECL[]}
            value={ecl}
            onChange={setEcl}
          />
        </Field>

        <Field label="logo.src">
          <input
            className={s.input}
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://example.com/logo.png"
          />
        </Field>
      </div>
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

function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
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
    </div>
  );
}
