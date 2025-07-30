/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false, // use JS fallback instead of native swc
  experimental: {
    optimizeCss: false, // already needed for Termux
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig;
