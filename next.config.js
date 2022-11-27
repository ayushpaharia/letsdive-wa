/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    swcMinify: true,
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
}

module.exports = nextConfig
