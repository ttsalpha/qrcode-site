// Bundle @ttsalpha/qrcode's toSVGString into a self-contained server module so
// /api/qr can call it server-side without a runtime import or file-tracing. The
// /server entry has no React and no client boundary, so nothing needs inlining
// or stripping. Runs before dev/build.

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

await build({
  stdin: {
    contents: 'export { toSVGString } from "@ttsalpha/qrcode/server";',
    resolveDir: root,
    loader: "js",
  },
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node20",
  outfile: resolve(root, "src/lib/qrcode-server.generated.cjs"),
  logLevel: "warning",
});
