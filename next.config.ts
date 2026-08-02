import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // sharp is native — keep it out of the server bundle (/api/qr rasterizes with it).
  serverExternalPackages: ["sharp"],
  // No outputFileTracingIncludes: qrcode is pre-bundled into the route (see
  // scripts/gen-qr-server.mjs) and nft traces sharp's binary automatically.
};

export default nextConfig;
