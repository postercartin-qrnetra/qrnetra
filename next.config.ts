import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/bulk-orders",
        destination: "/business-fleet",
        permanent: true,
      },
    ];
  },
  images: {
    localPatterns: [
      {
        pathname: "/logos/**",
      },
    ],
  },
  turbopack: {
    // Pin workspace root so Turbopack doesn't infer a parent directory's
    // stray package-lock.json (was breaking local builds, harmless on Vercel
    // but keeps build output identical across environments).
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
