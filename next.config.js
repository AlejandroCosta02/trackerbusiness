/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/auth/callback/google',
        destination: '/api/auth/callback/google',
      },
    ]
  },
}

module.exports = nextConfig 