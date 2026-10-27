/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 80, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.graphassets.com'
      },
      {
        protocol: 'https',
        hostname: 'images.are.na'
      },
      {
        protocol: 'https',
        hostname: 'd2w9rnfcy7mm78.cloudfront.net'
      }
    ]
  },
  experimental: {
    workerThreads: false,
    cpus: 1
  }
}

module.exports = nextConfig
