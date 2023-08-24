/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // send custom headers

  async rewrites() {
    return [
      {
        source: '/api/proxy',
        destination: 'https://play.ht/api/v2/tts',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/api/proxy',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ]
  },
}


module.exports = nextConfig;