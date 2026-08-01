import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

// Shared guards for routes that fetch user-supplied remote images
// (/api/proxy-image, /api/qr logo): SSRF, hangs, oversized bodies.

const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_MAX_BYTES = 2 * 1024 * 1024;
const MAX_REDIRECTS = 4;
const ALLOWED_PORTS = new Set([80, 443]);

// Is a concrete IP literal loopback / private / link-local / metadata / ULA /
// unspecified? Works on the actual resolved address, so it also catches
// IPv4-mapped IPv6 (::ffff:127.0.0.1) and hostnames that resolve to a private IP.
export function isPrivateAddress(ip: string): boolean {
  const kind = isIP(ip);
  if (kind === 4) return isPrivateIPv4(ip);
  if (kind === 6) return isPrivateIPv6(ip.toLowerCase());
  return true; // not a parseable IP → treat as unsafe
}

function isPrivateIPv4(ip: string): boolean {
  const p = ip.split(".").map(Number);
  if (
    p.length !== 4 ||
    p.some((n) => !Number.isInteger(n) || n < 0 || n > 255)
  ) {
    return true;
  }
  const [a, b] = p;
  // this-net, loopback, RFC1918 private, link-local/cloud-metadata, CGNAT
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const h = ip.replace(/%.*$/, ""); // drop zone id
  if (h === "::1" || h === "::" || h === "0:0:0:0:0:0:0:0") return true;
  const mapped = mappedIPv4(h);
  if (mapped) return isPrivateIPv4(mapped);
  const head = h.split(":")[0];
  // fe80::/10 link-local (fe80–febf) and fc00::/7 unique-local (fc/fd)
  if (
    /^fe[89ab]/.test(head) ||
    head.startsWith("fc") ||
    head.startsWith("fd")
  ) {
    return true;
  }
  return false;
}

// Extract the dotted IPv4 embedded in an IPv4-mapped IPv6 address, else null.
// Handles both ::ffff:127.0.0.1 and the normalized hex form ::ffff:7f00:1.
function mappedIPv4(h: string): string | null {
  const m = h.match(/^::ffff:(.+)$/i);
  if (!m) return null;
  const tail = m[1];
  if (tail.includes(".")) return isIP(tail) === 4 ? tail : null;
  const parts = tail.split(":");
  if (parts.length !== 2) return null;
  const hi = Number.parseInt(parts[0], 16);
  const lo = Number.parseInt(parts[1], 16);
  if (Number.isNaN(hi) || Number.isNaN(lo)) return null;
  return `${(hi >> 8) & 255}.${hi & 255}.${(lo >> 8) & 255}.${lo & 255}`;
}

// Reject a URL that isn't plain http(s) on a web port, or that targets a private
// host. For domains, resolves DNS and rejects if ANY resolved address is private.
// Throws on rejection (caller maps to null). Note: does not pin the connection to
// the validated IP, so a DNS-rebinding race remains (acceptable for an image proxy).
async function assertPublicUrl(url: URL): Promise<void> {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("protocol");
  }
  const port =
    url.port === "" ? (url.protocol === "https:" ? 443 : 80) : Number(url.port);
  if (!ALLOWED_PORTS.has(port)) throw new Error("port");

  const host = url.hostname
    .replace(/^\[|\]$/g, "")
    .replace(/\.$/, "")
    .toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost")) {
    throw new Error("host");
  }

  if (isIP(host)) {
    if (isPrivateAddress(host)) throw new Error("host");
    return;
  }
  const addrs = await lookup(host, { all: true });
  if (addrs.length === 0 || addrs.some((a) => isPrivateAddress(a.address))) {
    throw new Error("host");
  }
}

export interface RemoteImage {
  contentType: string;
  buffer: ArrayBuffer;
}

// Read a response body, aborting if it exceeds `cap` bytes (streaming so a
// server can't blow up memory by lying about content-length).
async function readCapped(
  res: Response,
  cap: number,
): Promise<ArrayBuffer | null> {
  const reader = res.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > cap) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out.buffer;
}

// Fetch a remote image behind SSRF / timeout / size / content-type guards.
// Follows redirects MANUALLY, re-validating each hop, so an initially-public URL
// can't 3xx into a private target. Returns null on any failure — the caller
// decides the HTTP status.
export async function fetchRemoteImage(
  input: URL,
  { timeoutMs = DEFAULT_TIMEOUT_MS, maxBytes = DEFAULT_MAX_BYTES } = {},
): Promise<RemoteImage | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let url = input;
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      await assertPublicUrl(url);
      const res = await fetch(url, {
        signal: controller.signal,
        redirect: "manual",
      });
      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("location");
        if (!location) return null;
        url = new URL(location, url); // resolve relative, re-validated next loop
        continue;
      }
      if (!res.ok) return null;
      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.startsWith("image/")) return null;
      const declared = Number(res.headers.get("content-length"));
      if (Number.isFinite(declared) && declared > maxBytes) return null;
      const buffer = await readCapped(res, maxBytes);
      if (!buffer) return null;
      return { contentType, buffer };
    }
    return null; // too many redirects
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
