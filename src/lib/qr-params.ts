import type {
  CornerDotStyle,
  CornerSquareStyle,
  DotStyle,
  QRCodeProps,
} from "@ttsalpha/qrcode";

// Shared param mapping for /api/qr: parseQRParams (query → props) for the route,
// buildQRUrl (props → link) for the Playground's "Copy link" button.

export type QRFormat = "svg" | "png" | "jpg";

// Library defaults; buildQRUrl omits any value equal to these to keep links
// short. Keep in sync with @ttsalpha/qrcode.
export const QR_DEFAULTS = {
  size: 256,
  margin: 4,
  dotStyle: "square" as DotStyle,
  dotColor: "#000000",
  backgroundColor: "#ffffff",
  format: "svg" as QRFormat,
};

const DOT_STYLES = ["square", "circle", "rounded"] as const;
const CORNER_SQUARE_STYLES = [
  "square",
  "rounded",
  "extra-rounded",
  "circle",
] as const;
const CORNER_DOT_STYLES = ["square", "rounded", "circle"] as const;
const ECLS = ["L", "M", "Q", "H"] as const;
export const QR_FORMATS: readonly QRFormat[] = ["svg", "png", "jpg"];

export const HEX6 = /^#[0-9a-fA-F]{6}$/;

// Corner-dot style the library derives from the square style when the dot style
// is left unset — lets buildQRUrl drop a redundant cornerDotStyle param.
export function deriveCornerDotStyle(
  square: CornerSquareStyle | undefined,
): CornerDotStyle {
  if (square === "extra-rounded") return "rounded";
  if (square === "circle") return "circle";
  return "square";
}

// ─── Parse: query string → QRCodeProps ────────────────────────────────────────

class ParamError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export type ParseResult =
  | { ok: true; props: QRCodeProps; format: QRFormat }
  | { ok: false; status: number; message: string };

function enumParam<T extends string>(
  sp: URLSearchParams,
  key: string,
  allowed: readonly T[],
): T | undefined {
  const v = sp.get(key);
  if (v == null) return undefined;
  if (!allowed.includes(v as T)) {
    throw new ParamError(400, `invalid \`${key}\`: ${v}`);
  }
  return v as T;
}

function numberParam(
  sp: URLSearchParams,
  key: string,
  min: number,
  max: number,
  round: boolean,
): number | undefined {
  const v = sp.get(key);
  if (v == null) return undefined;
  const n = Number(v);
  if (!Number.isFinite(n)) {
    throw new ParamError(400, `invalid \`${key}\`: ${v}`);
  }
  const clamped = Math.min(max, Math.max(min, n));
  return round ? Math.round(clamped) : clamped;
}

function colorParam(
  sp: URLSearchParams,
  key: string,
  allowTransparent = false,
): string | undefined {
  const v = sp.get(key);
  if (v == null) return undefined;
  if (allowTransparent && v === "transparent") return v;
  if (!HEX6.test(v)) {
    throw new ParamError(400, `invalid \`${key}\` (expected #rrggbb): ${v}`);
  }
  return v;
}

function boolParam(sp: URLSearchParams, key: string): boolean | undefined {
  const v = sp.get(key);
  if (v == null) return undefined;
  if (v === "true" || v === "1") return true;
  if (v === "false" || v === "0") return false;
  return undefined;
}

export function parseQRParams(sp: URLSearchParams): ParseResult {
  try {
    const data = sp.get("data");
    if (!data) throw new ParamError(400, "missing `data` param");

    const props: QRCodeProps = { value: data };

    const size = numberParam(sp, "size", 64, 2048, true);
    if (size !== undefined) props.size = size;
    const margin = numberParam(sp, "margin", 0, 20, true);
    if (margin !== undefined) props.margin = margin;

    const dotStyle = enumParam(sp, "dotStyle", DOT_STYLES);
    if (dotStyle) props.dotStyle = dotStyle;
    const dotColor = colorParam(sp, "dotColor");
    if (dotColor) props.dotColor = dotColor;
    const bg = colorParam(sp, "bg", true);
    if (bg) props.backgroundColor = bg;

    const sqStyle = enumParam(sp, "cornerSquareStyle", CORNER_SQUARE_STYLES);
    const sqColor = colorParam(sp, "cornerSquareColor");
    const cdStyle = enumParam(sp, "cornerDotStyle", CORNER_DOT_STYLES);
    const cdColor = colorParam(sp, "cornerDotColor");
    if (sqStyle || sqColor || cdStyle || cdColor) {
      props.corner = {
        square:
          sqStyle || sqColor ? { style: sqStyle, color: sqColor } : undefined,
        dot:
          cdStyle || cdColor ? { style: cdStyle, color: cdColor } : undefined,
      };
    }

    const ecl = enumParam(sp, "ecl", ECLS);
    const version = numberParam(sp, "qrVersion", 1, 40, true);
    if (ecl || version !== undefined) {
      props.qr = { errorCorrectionLevel: ecl, version };
    }

    const logoSrc = sp.get("logo");
    if (logoSrc) {
      props.logo = {
        src: logoSrc,
        size: numberParam(sp, "logoSize", 0, 1, false),
        margin: numberParam(sp, "logoMargin", 0, 1000, false),
        hideDots: boolParam(sp, "logoHideDots"),
      };
    }

    const format = enumParam(sp, "format", QR_FORMATS) ?? QR_DEFAULTS.format;

    return { ok: true, props, format };
  } catch (e) {
    if (e instanceof ParamError) {
      return { ok: false, status: e.status, message: e.message };
    }
    return { ok: false, status: 400, message: "invalid parameters" };
  }
}

// ─── Build: QRCodeProps → link ────────────────────────────────────────────────

export function buildQRUrl(
  props: QRCodeProps,
  format: QRFormat,
  origin: string,
): string {
  const p = new URLSearchParams();
  p.set("data", props.value);

  const dotColor = props.dotColor ?? QR_DEFAULTS.dotColor;

  if (props.size !== undefined && props.size !== QR_DEFAULTS.size) {
    p.set("size", String(props.size));
  }
  if (props.margin !== undefined && props.margin !== QR_DEFAULTS.margin) {
    p.set("margin", String(props.margin));
  }
  if (props.dotStyle && props.dotStyle !== QR_DEFAULTS.dotStyle) {
    p.set("dotStyle", props.dotStyle);
  }
  if (props.dotColor && props.dotColor !== QR_DEFAULTS.dotColor) {
    p.set("dotColor", props.dotColor);
  }
  if (
    props.backgroundColor &&
    props.backgroundColor !== QR_DEFAULTS.backgroundColor
  ) {
    p.set("bg", props.backgroundColor);
  }

  const sqStyle = props.corner?.square?.style;
  const sqColor = props.corner?.square?.color;
  const cdStyle = props.corner?.dot?.style;
  const cdColor = props.corner?.dot?.color;
  if (sqStyle && sqStyle !== "square") p.set("cornerSquareStyle", sqStyle);
  if (sqColor && sqColor !== dotColor) p.set("cornerSquareColor", sqColor);
  if (cdStyle && cdStyle !== deriveCornerDotStyle(sqStyle)) {
    p.set("cornerDotStyle", cdStyle);
  }
  if (cdColor && cdColor !== dotColor) p.set("cornerDotColor", cdColor);

  if (props.qr?.errorCorrectionLevel)
    p.set("ecl", props.qr.errorCorrectionLevel);
  if (props.qr?.version !== undefined) {
    p.set("qrVersion", String(props.qr.version));
  }

  // Only remote logos fit in a URL; data:/blob: uploads are dropped (caller warns).
  const logoSrc = props.logo?.src;
  if (logoSrc && /^https?:\/\//i.test(logoSrc)) {
    p.set("logo", logoSrc);
    if (props.logo?.size !== undefined)
      p.set("logoSize", String(props.logo.size));
    if (props.logo?.margin !== undefined) {
      p.set("logoMargin", String(props.logo.margin));
    }
    if (props.logo?.hideDots === false) p.set("logoHideDots", "false");
  }

  if (format !== QR_DEFAULTS.format) p.set("format", format);

  return `${origin}/api/qr?${p.toString()}`;
}
