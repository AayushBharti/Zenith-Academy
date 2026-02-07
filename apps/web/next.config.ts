import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizeCss: true,
  },
  images: {
    minimumCacheTTL: 3_153_600,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
