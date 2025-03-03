// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,  // Ensure this is enabled
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fonts.googleapis.com',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };
    return config;
  }
}

module.exports = nextConfig