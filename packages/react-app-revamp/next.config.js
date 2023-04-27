/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
    dir: "ltr",
  },
  images: {
    domains: ["lens.infura-ipfs.io"],
  },
};

module.exports = nextConfig;
