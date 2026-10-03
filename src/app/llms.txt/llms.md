# @ttsalpha/qrcode

> Lightweight QR code library for React and React Native: pure SVG, zero dependencies, fully typed. Covers SSR, custom dot/corner shapes, logo embedding, and PNG/SVG export. Version 3.1.0. MIT license.

Requires React 18+ as peer dependency. React Native also needs `react-native-svg` (optional peer).

Install: `pnpm add @ttsalpha/qrcode`

Quick start:

```tsx
import { QRCode } from '@ttsalpha/qrcode';

export default function App() {
  return <QRCode value="https://example.com" />;
}
```

Entry points:

| Import from | Contents | Needs at runtime |
|---|---|---|
| `@ttsalpha/qrcode` | `<QRCode>`, `toSVGString`, `toDataURL` | React 18+ |
| `@ttsalpha/qrcode/server` | `toSVGString`, `toDataURL`; no client boundary, for React Server Components | nothing (`toDataURL` needs a browser) |
| `@ttsalpha/qrcode/native` | `<QRCode>` for React Native and Expo | React 18+, `react-native-svg` |
| `@ttsalpha/qrcode/core` | `buildQR`, `toSVGString`; no React, no DOM | nothing |

**QRCodeProps**

| Prop | Type | Default | Description |
|---|---|---|---|
| value | string | — | Data to encode (required) |
| size | number | 256 | Width and height in pixels |
| margin | number | 4 | Quiet zone in modules |
| dotStyle | DotStyle | 'square' | Style of data modules |
| dotColor | string | '#000000' | Color of data modules |
| backgroundColor | string | '#ffffff' | Background color; 'transparent' accepted |
| corner | CornerOptions | — | Finder pattern styles and colors |
| logo | LogoOptions | — | Logo in center |
| qr | QROptions | — | QR encoding options |
| className | string | — | CSS class on `<svg>` |
| style | CSSProperties | — | Inline style on `<svg>` |
| ariaLabel | string | — | Accessible label; defaults to 'QR code: {value}' |

**DotStyle**: `'square'` (default) | `'circle'` | `'rounded'` (adjacent modules connect smoothly)

**CornerOptions**:

```ts
interface CornerOptions {
  dot?: { style?: 'square' | 'rounded' | 'circle'; color?: string }; // inner 3×3 block
  square?: { style?: 'square' | 'rounded' | 'extra-rounded' | 'circle'; color?: string }; // outer 7×7 ring
}
```

When `square.style` is `'extra-rounded'` and dot is unset, dot defaults to `'rounded'`. When `'circle'`, dot defaults to `'circle'`.

**LogoOptions**:

```ts
interface LogoOptions {
  src?: string;         // https, relative path, blob:, or data:image/… URI
  element?: ReactNode;  // takes priority over src
  size?: number;        // 0–1 relative to max safe area; ECL auto-picked; default 0.4
  aspectRatio?: number; // width / height; measured from src when omitted
  margin?: number;      // gap between logo and cleared area edge, in modules; default 0
  hideDots?: boolean;   // clear dots behind logo via SVG mask; default true
  radius?: number;      // corner radius, 0 (square) to 1 (fully rounded); default 0
}
```

ECL auto-picked by size: ≤0.25 → L, ≤0.44 → M, ≤0.69 → Q, ≤1.0 → H. `javascript:` and non-image `data:` URIs are silently rejected.

**QROptions**: `errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'` (default M) · `version?: number` (1–40, auto)

**React Native and Expo**:

```tsx
import { QRCode } from '@ttsalpha/qrcode/native';

<QRCode
  value="https://example.com"
  size={240}
  dotStyle="rounded"
  corner={{ square: { style: 'extra-rounded' } }}
  logo={{ src: require('./logo.png'), radius: 0.3 }}
  onError={(error) => console.warn(error.message)}
/>
```

Install `react-native-svg` too (`npx expo install react-native-svg` on Expo). Needs React Native 0.75+ (the encoder uses the global `TextEncoder`) and a Metro that resolves package `exports` (default from React Native 0.79 and Expo SDK 53).

`value`, `size`, `margin`, `dotStyle`, `dotColor`, `backgroundColor`, `corner` and `qr` behave as in QRCodeProps. Differences: no `className`; `style`, `testID` and other `<Svg>` props are passed through; `ariaLabel` becomes `accessibilityLabel`; `onError(error)` is called instead of throwing when the symbol cannot be drawn. The logo takes `src` as a URL or a `require()`d asset, or `svg` as SVG markup, plus `size`, `aspectRatio`, `margin`, `hideDots` and `radius`; `logo.element` is not supported. The ref goes to the `Svg`, so `ref.current.toDataURL((base64) => …)` returns a PNG. There is no `toDataURL(props)` helper on native; for an SVG string import `toSVGString` from `@ttsalpha/qrcode/core`.

**Core** (no React, no DOM):

```ts
import { buildQR } from '@ttsalpha/qrcode/core';

// QRGeometry: size, viewBox, ecLevel, background, modules, finders, clear, logo, warnings
const geometry = buildQR({ value: 'https://example.com', size: 256 });
```

**Export helpers**:

```ts
import { toSVGString, toDataURL } from '@ttsalpha/qrcode';

// Server-side SVG, no DOM or React required
// (in a React Server Component import from '@ttsalpha/qrcode/server')
const svg = toSVGString({ value: 'https://example.com', size: 512 });

// PNG data URL via Canvas (browser-only)
const png = await toDataURL({ value: 'https://example.com', size: 512 });

// JPEG
const jpg = await toDataURL({ value: 'https://example.com' }, { format: 'jpeg', quality: 0.9 });
```

`toDataURL` is browser-only (Canvas API). JPEG auto-fills white background when `backgroundColor` is `'transparent'`.

vs. alternatives: 2.9× faster cold start than qrcode.react · 45× faster styled renders than qr-code-styling · SSR/Edge-safe (no Canvas dependency) · adds dot styles, logo, per-corner colors, export helpers over react-qr-code

## Docs

- [Homepage](https://qrcode.ttsalpha.com): Interactive playground, install guide, feature overview
- [API Reference](https://qrcode.ttsalpha.com/reference): Every prop, type, entry point, React Native option, export helper, and HTTP API param with defaults
- [Examples](https://qrcode.ttsalpha.com/examples): Dot styles, corner styles, colors, logos, rounded logos, transparent background, React Native, export helpers
- [Benchmark](https://qrcode.ttsalpha.com/benchmark): Performance comparison vs qrcode.react, qr-code-styling, react-qr-code, and qrcode

## Optional

- [npm](https://www.npmjs.com/package/@ttsalpha/qrcode)
- [GitHub](https://github.com/ttsalpha/qrcode)
