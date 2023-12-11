/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa");

const nextConfig = {
  reactStrictMode: false,
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  images: {
    domains: ["lens.infura-ipfs.io", "ik.imagekit.io"],
  },
  transpilePackages: ["react-tweet"],
};

module.exports = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // 5mb
})(nextConfig);
