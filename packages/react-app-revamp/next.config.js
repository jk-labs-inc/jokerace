/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  },
  images: {
    domains: ["lens.infura-ipfs.io", "ik.imagekit.io"],
  },
};

module.exports = nextConfig;
