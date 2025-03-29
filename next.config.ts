import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        "@nutrient-sdk/viewer": "@nutrient-sdk/viewer",
      });
    }

    return config;
  },
  images: {
    domains: ["ritease.com"],
  },
  experimental: {
    turbo: {
      resolveAlias: {
        "@nutrient-sdk/viewer": "@nutrient-sdk/viewer",
      },
    },
  },
};

export default nextConfig;
