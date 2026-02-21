/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    // Enable webpack caching to reduce memory usage
    // Removed config.cache = false to allow default caching
    return config;
  },
}

module.exports = nextConfig