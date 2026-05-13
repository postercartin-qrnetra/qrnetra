import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin workspace root so Turbopack doesn't infer a parent directory's
    // stray package-lock.json (was breaking local builds, harmless on Vercel
    // but keeps build output identical across environments).
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
