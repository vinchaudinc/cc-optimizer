import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@napi-rs/canvas", "pdf-parse"],
  outputFileTracingIncludes: {
    "/api/analyze": [
      "./node_modules/@napi-rs/canvas/**/*",
      "./node_modules/@napi-rs/canvas-*/*",
      "./node_modules/pdf-parse/**/*",
      "./node_modules/pdf-parse/node_modules/@napi-rs/**/*",
      "./node_modules/pdf-parse/node_modules/@napi-rs/canvas-*/*",
      "./node_modules/pdf-parse/node_modules/pdfjs-dist/**/*",
    ],
  },
};

export default nextConfig;
