import type { NextConfig } from "next";

/** Set when building for GitHub Pages (e.g. /iconify-search). Leave unset for Vercel/local. */
const githubPagesBase =
  process.env.GITHUB_PAGES_BASE_PATH?.replace(/\/$/, "") ?? "";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  output: "export",
  ...(githubPagesBase && {
    basePath: githubPagesBase,
    assetPrefix: githubPagesBase,
    trailingSlash: true,
  }),
};

export default nextConfig;
