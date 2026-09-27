import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.31.110",
    "192.168.31.110:3000",
    "localhost:3000",
  ],
};

export default nextConfig;
