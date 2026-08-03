import { readFileSync } from "node:fs";
import { join } from "node:path";

export const dynamic = "force-static";

// Read at build time (force-static prerenders the response), so the URL stays
// /llms.txt and the content lives in an editable markdown file next to it.
const content = readFileSync(
  join(process.cwd(), "src/app/llms.txt/llms.md"),
  "utf8",
);

export function GET() {
  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
