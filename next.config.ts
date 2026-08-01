import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // sharp is native — keep it out of the server bundle (/api/qr rasterizes with it).
  serverExternalPackages: ["sharp"],
  // /api/qr imports @ttsalpha/qrcode via a runtime (turbopackIgnore) import that
  // file tracing can't see — force it into the route bundle.
  outputFileTracingIncludes: {
    // whole package (incl. package.json) so the runtime import resolves on Vercel
    "/api/qr": ["./node_modules/@ttsalpha/qrcode/**/*"],
  },
};

export default nextConfig;
