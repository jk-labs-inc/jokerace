/** @type {import('next').NextConfig} */
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
};

module.exports = nextConfig;
