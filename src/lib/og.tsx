import { ImageResponse } from "next/og";
import { SITE_URL } from "@/lib/metadata";
// Pre-bundled server build: the published package ships "use client"
import { toSVGString } from "@/lib/qrcode-server.generated.cjs";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const HOST = SITE_URL.replace("https://", "");
const FONT = "Google Sans";
const CHIPS = ["Pure SVG", "Zero dependencies", "SSR-safe"];

// One SVG layer, because satori does not tile background gradients. Dots are
// the mask, the corner-to-middle fade is the fill's stop-opacity.
const DOT_GRID = (() => {
  const { width, height } = OG_SIZE;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">\
<defs>\
<pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="13" cy="13" r="1.6" fill="#ffffff"/></pattern>\
<mask id="grid"><rect width="100%" height="100%" fill="url(#dots)"/></mask>\
<radialGradient id="fade" cx="0%" cy="0%" r="64%">\
<stop offset="0%" stop-color="#6b6b6b" stop-opacity="1"/>\
<stop offset="55%" stop-color="#6b6b6b" stop-opacity="0.55"/>\
<stop offset="100%" stop-color="#6b6b6b" stop-opacity="0"/>\
</radialGradient>\
</defs>\
<rect width="100%" height="100%" fill="url(#fade)" mask="url(#grid)"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
})();

// A data URI image, because satori has no <svg> element support
function qrDataUri(value: string) {
  const svg = toSVGString({
    value,
    size: 300,
    margin: 1,
    dotStyle: "rounded",
    corner: {
      square: { style: "extra-rounded", color: "#14b8a6" },
      dot: { style: "rounded" },
    },
  });
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/**
 * Rewrites the table directory without one table; data stays put because the
 * directory holds absolute offsets. Used to drop GSUB, which satori's
 * opentype.js walks for ligatures and throws on for Google Sans:
 * "lookupType: 7 - substFormat: 1 is not yet supported".
 */
function dropSfntTable(font: ArrayBuffer, tag: string) {
  const out = new DataView(font.slice(0));
  const numTables = out.getUint16(4);

  const entries: number[] = [];
  let dropped = false;
  for (let i = 0; i < numTables; i++) {
    const at = 12 + i * 16;
    const name = String.fromCharCode(
      out.getUint8(at),
      out.getUint8(at + 1),
      out.getUint8(at + 2),
      out.getUint8(at + 3),
    );
    if (name === tag) dropped = true;
    else entries.push(at);
  }
  if (!dropped) return font;

  const rows = entries.map((at) => new Uint8Array(font.slice(at, at + 16)));
  const bytes = new Uint8Array(out.buffer);
  rows.forEach((row, i) => {
    bytes.set(row, 12 + i * 16);
  });
  bytes.fill(0, 12 + rows.length * 16, 12 + numTables * 16);

  const entrySelector = Math.floor(Math.log2(rows.length));
  const searchRange = 2 ** entrySelector * 16;
  out.setUint16(4, rows.length);
  out.setUint16(6, searchRange);
  out.setUint16(8, entrySelector);
  out.setUint16(10, rows.length * 16 - searchRange);

  return out.buffer;
}

// `text` subsets the file, taking Google Sans from ~1.9 MB to ~25 kB per weight
async function googleFont(weight: 400 | 700, text: string) {
  const family = FONT.replace(/ /g, "+");
  const params = new URLSearchParams({ text });
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&${params}`,
    // A modern User-Agent gets woff2 back, which satori cannot parse
    { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1)" } },
  ).then((r) => r.text());
  const url = css.match(/src: url\((https:[^)]+)\) format\('truetype'\)/)?.[1];
  if (!url) throw new Error(`no ttf url for ${FONT} ${weight}`);
  const ttf = await fetch(url).then((r) => r.arrayBuffer());
  return dropSfntTable(ttf, "GSUB");
}

async function loadFonts(text: string) {
  try {
    const [regular, bold] = await Promise.all([
      googleFont(400, text),
      googleFont(700, text),
    ]);
    return [
      {
        name: FONT,
        data: regular,
        weight: 400 as const,
        style: "normal" as const,
      },
      {
        name: FONT,
        data: bold,
        weight: 700 as const,
        style: "normal" as const,
      },
    ];
  } catch {
    // Never break the build over a font; satori falls back to its default
    return undefined;
  }
}

// Every glyph the images may use: anything outside this set renders blank
const GLYPHS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,:;/@#&+-·()'\"";

// At module load, not in the handler, which would opt the route out of prerender
const FONTS = loadFonts(GLYPHS);

type OgProps = {
  tag: string;
  /** Muted prefix rendered before the title, e.g. "@ttsalpha/" */
  titlePrefix?: string;
  title: string;
  subtitle: string;
  /** Path the QR encodes and that shows in the footer, e.g. "/reference" */
  path?: string;
};

export async function ogImage({
  tag,
  titlePrefix,
  title,
  subtitle,
  path = "",
}: OgProps) {
  const url = `${SITE_URL}${path}`;
  const fonts = await FONTS;

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#101010",
        fontFamily: FONT,
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: satori has no next/image */}
      <img
        src={DOT_GRID}
        width={OG_SIZE.width}
        height={OG_SIZE.height}
        alt=""
        style={{ position: "absolute", top: 0, left: 0 }}
      />

      <div
        style={{
          display: "flex",
          height: 8,
          width: 1200,
          background: "#14b8a6",
        }}
      />

      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 76px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 640 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 13,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 9,
                height: 9,
                borderRadius: 5,
                background: "#2dd4bf",
              }}
            />
            <div style={{ fontSize: 25, color: "#2dd4bf", letterSpacing: 0.5 }}>
              {tag}
            </div>
          </div>

          {/* Tracking on the spans, not the row: satori would overlap the two */}
          <div style={{ display: "flex", fontSize: 72, lineHeight: 1.05 }}>
            {titlePrefix && (
              <span
                style={{
                  color: "#7d7d7d",
                  fontWeight: 700,
                  letterSpacing: -2,
                  flexShrink: 0,
                }}
              >
                {titlePrefix}
              </span>
            )}
            <span
              style={{
                color: "#fafafa",
                fontWeight: 700,
                letterSpacing: -2,
                flexShrink: 0,
              }}
            >
              {title}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: 27,
              lineHeight: 1.5,
              color: "#d4d4d4",
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            padding: 20,
            borderRadius: 30,
            background: "#ffffff",
            boxShadow:
              "0 0 0 1px rgba(45,212,191,0.45), 0 28px 70px rgba(0,0,0,0.55)",
          }}
        >
          {/* biome-ignore lint/performance/noImgElement: satori has no next/image */}
          <img src={qrDataUri(url)} width={268} height={268} alt="" />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 104,
          padding: "0 76px",
          borderTop: "1px solid #3a3a3a",
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          {CHIPS.map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                padding: "9px 18px",
                borderRadius: 999,
                border: "1px solid #454545",
                background: "#242424",
                fontSize: 22,
                color: "#e5e5e5",
              }}
            >
              {chip}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 23, color: "#a8a8a8" }}>
          {HOST}
          {path}
        </div>
      </div>
    </div>,
    { ...OG_SIZE, ...(fonts ? { fonts } : {}) },
  );
}
