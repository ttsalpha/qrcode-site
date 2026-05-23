---
name: migrate-qrcode
description: Migrate @ttsalpha/qrcode-site to a new version of @ttsalpha/qrcode. Installs latest, diffs the API, and updates page/playground/docs/examples to match. Use when the user says "migrate", "upgrade qrcode", or "update the lib".
---

# migrate-qrcode

Automates upgrading `@ttsalpha/qrcode` on the docs site and keeping all content in sync with the new API.

## When to use

- User says: "migrate", "upgrade qrcode", "update lib", or runs `/migrate-qrcode`

---

## Workflow

### Step 1 — Capture the current version

```bash
node -e "console.log(require('./node_modules/@ttsalpha/qrcode/package.json').version)"
```

Save this as `OLD_VERSION`.

### Step 2 — Resolve and install the latest version

Fetch the exact latest version from the registry:

```bash
pnpm info @ttsalpha/qrcode version
```

Save this as `NEW_VERSION`. If `OLD_VERSION === NEW_VERSION`, report "already on latest" and stop.

Install that exact version explicitly (not `@latest` — avoids pnpm semver resolution surprises):

```bash
pnpm add @ttsalpha/qrcode@<NEW_VERSION>
```

### Step 3 — Read the changelog and new API surface

Check for a changelog first:

```bash
cat node_modules/@ttsalpha/qrcode/CHANGELOG.md 2>/dev/null || echo "no changelog"
```

Then read the full API surface:

```bash
cat node_modules/@ttsalpha/qrcode/README.md
cat node_modules/@ttsalpha/qrcode/dist/index.d.ts
```

Also read the current site's API documentation to establish a baseline before diffing:

```
src/app/page.tsx        (API tables, code blocks, notes, examples, hero)
src/components/Playground.tsx  (controls, state, snippet generation)
```

Now extract every difference between `OLD_VERSION` and `NEW_VERSION`:

| Category | What to look for |
|---|---|
| **New props** | Fields in `QRCodeProps` not in the current API table |
| **Removed props** | Fields present in the site but gone from types |
| **Changed defaults** | JSDoc `Default:` values that differ from what the site documents |
| **Changed behavior** | Notes about auto-pick, clamping, limits, security |
| **New types/unions** | New `DotStyle`, `CornerDotStyle`, `CornerSquareStyle` values |
| **New exports** | Named exports beyond `QRCode`, `toSVGString`, `toDataURL` |
| **Changed export signatures** | Param types or option shapes for helper functions |
| **New README examples** | Patterns not covered by any existing `<Example>` card |

### Step 4 — Plan all edits

For each change found in Step 3, identify exactly what needs updating. Note the line or section.

**New prop:**
- [ ] Add row to the `QRCodeProps` table in `page.tsx`
- [ ] Add control to the relevant `<Group>` in `Playground.tsx`
- [ ] Add to `buildProps()` in `Playground.tsx`
- [ ] Add to snippet generation (only emit when non-default)

**Removed prop:**
- [ ] Remove table row from `page.tsx`
- [ ] Remove control from `Playground.tsx`
- [ ] Remove from `buildProps()` and snippet generation

**Changed default:**
- [ ] Update `Default` column in the API table in `page.tsx`
- [ ] Rewrite the inline comment in the affected type code block
- [ ] Update the note paragraph below the code block
- [ ] Update initial `useState` value in `Playground.tsx` if it mirrors the default
- [ ] Update `placeholder` text if it shows the default
- [ ] Update snippet omission condition (e.g. `if (val !== DEFAULT)`)

**Changed behavior / new thresholds:**
- [ ] Update the note paragraph in the relevant `<div className={s.apiGroup}>` in `page.tsx`
- [ ] Update `<Field>` label or placeholder hints in `Playground.tsx` if they reference limits

**New type value (e.g. new `DotStyle`):**
- [ ] Add to the type table in `page.tsx`
- [ ] Add to the `options` array of the corresponding `<Tabs>` in `Playground.tsx`

**New export:**
- [ ] Add to the Export Helpers section in `page.tsx` with a usage example

**New feature (capability that didn't exist before):**
- [ ] Add or update a feature card in the `#features` grid in `page.tsx`

**New README example worth showcasing:**
- [ ] Add an `<Example>` card in `#examples` — prefer updating an existing card if it covers the same concept

### Step 5 — Apply all changes

Make every edit identified in Step 4. Apply all changes to each file in one pass.

**Rules while editing:**

- Match the existing code style exactly (2-space indent, single quotes, named exports)
- When an interface changes, rewrite the entire code block — partial diffs inside JSX string literals are unreadable
- In `Playground.tsx`, new controls go inside the most relevant `<Group>` (`Appearance`, `Corners`, `QR Settings`, `Dimensions`, `Logo`)
- Snippet generation must only emit a prop when its value differs from the library default
- Never add comments explaining what changed — the diff does that
- Do not touch sections unrelated to the diff

### Step 6 — Verify

Run all three in order. Fix any failure before running the next.

```bash
pnpm lint
```

Fix all Biome errors and warnings, re-run until clean.

```bash
pnpm format
```

Writes changes in-place. Re-run until no files are modified.

```bash
pnpm build
```

Fix all TypeScript and build errors, re-run until clean.

Do not commit if any of the three fails.

### Step 7 — Commit

Stage all modified files, including `package.json`, `pnpm-lock.yaml`, and `pnpm-workspace.yaml` if touched.

Use the `commit-conventions` skill — let it determine the correct type from the diff.

---

## Site structure reference

```
src/
  app/
    page.tsx          ← Server Component; all docs content lives here
    page.module.css
    layout.tsx        ← reads theme cookie, sets data-theme on <html>
  components/
    Playground.tsx    ← "use client"; interactive editor
    Playground.module.css
    CodeBlock.tsx     ← async Server Component; shiki highlighting
    CopyButton.tsx    ← "use client"
    ThemeToggle.tsx   ← "use client"
    NavMenu.tsx
    PlaygroundLoader.tsx
```

### Key sections in `page.tsx`

| Section id | Content |
|---|---|
| hero | Three preview QR codes (square / rounded / circle) |
| `#playground` | `<PlaygroundLoader />` — no docs content here |
| `#features` | Feature cards grid |
| `#installation` | Install + quick-start code blocks |
| `#api` | `QRCodeProps`, `DotStyle`, `CornerOptions`, `LogoOptions`, `QROptions`, Export Helpers |
| `#examples` | `<Example>` cards with live QR + code snippet |

### Key state in `Playground.tsx`

| State | Type | Default | Notes |
|---|---|---|---|
| `value` | `string` | `"https://github.com/ttsalpha/qrcode"` | QR content |
| `dotStyle` | `DotStyle` | `"rounded"` | |
| `dotColor` | `string` | `"#000000"` | |
| `bgColor` | `string` | `"#ffffff"` | |
| `size` | `number` | `256` | |
| `margin` | `number` | `4` | |
| `sqStyle` | `CornerSquareStyle` | `"extra-rounded"` | |
| `sqColor` | `string` | `"#14b8a6"` | |
| `dotSt` | `CornerDotStyle` | `"rounded"` | |
| `dotDotColor` | `string` | `""` | empty = inherit |
| `ecl` | `ECL = "" \| "L"\|"M"\|"Q"\|"H"` | `""` | empty = auto-pick |
| `qrVersion` | `number \| ""` | `""` | empty = auto |
| `logoUrl` | `string` | `""` | |
| `logoSize` | `number \| ""` | `""` | empty = lib default |
| `logoMargin` | `number \| ""` | `""` | empty = 0 |
| `logoHideDots` | `boolean` | `true` | |

### Snippet omission rules

The snippet only includes a prop when it deviates from the library default:

- `size !== 256`
- `margin !== 4`
- `dotStyle !== 'square'`
- `dotColor !== '#000000'`
- `bgColor !== '#ffffff'`
- `sqStyle !== 'square'` or `sqColor` set
- `dotSt !== 'square'` or `dotDotColor` set
- `ecl !== ''` (user explicitly chose L/M/Q/H)
- `qrVersion !== ''`
- any logo field when `logoUrl` is set

---

## Common pitfalls

- **Never trust training data for defaults** — always read `dist/index.d.ts` JSDoc `Default:` annotations; they are the source of truth
- **`pnpm info` queries the registry** — requires network; if offline, check npmjs.com manually
- **`pnpm add` may touch `pnpm-workspace.yaml`** — include it in the commit if modified
- **Interface code blocks must be rewritten in full** — partial edits inside JSX template strings produce broken output
- **Biome, not ESLint/Prettier** — `pnpm lint` uses Biome; do not add ESLint config
- **Dark mode has two selectors** — `@media (prefers-color-scheme: dark)` and `[data-theme="dark"]` in `globals.css` must stay in sync when adding new color rules
