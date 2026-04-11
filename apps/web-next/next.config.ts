import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@banxe/shared", "@banxe/design-tokens"],
};

export default nextConfig;
