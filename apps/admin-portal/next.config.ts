// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This forces all static assets to be fetched from the root,
  // preventing the /admin/ prefix from breaking the CSS path.
  assetPrefix: "/",
  basePath: "/admin", // Tell the app it lives under /admin
};

module.exports = nextConfig;
