/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/admin/structure/:path*',
        destination: '/admin',
        permanent: false,
      },
      {
        source: '/admin/structure',
        destination: '/admin',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
