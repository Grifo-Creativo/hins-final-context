// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hins.com.ar",
        pathname: "/wp-content/**",
      },
    ],
  },
};

export default nextConfig;
