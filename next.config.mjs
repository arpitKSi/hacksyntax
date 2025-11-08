import path from "path";
import { fileURLToPath } from "url";

// __dirname replacement for ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "utfs.io" },
      { hostname: "img.clerk.com" },
      { hostname: "images.unsplash.com" },
    ],
  },
  webpack: (config) => {
    // Force all imports of @clerk/nextjs to resolve to our local shims for
    // local development so the app can run without real Clerk keys.
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@clerk/nextjs": path.resolve(__dirname, "./shims/clerk.tsx"),
      "@clerk/nextjs/server": path.resolve(__dirname, "./shims/clerk-server.ts"),
    };
    return config;
  },
};

export default nextConfig;
