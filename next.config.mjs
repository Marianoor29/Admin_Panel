/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.offerboats.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'offerboat-app-images.s3.us-east-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'offerboat-app-images.s3.amazonaws.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.182',
      },
    ],
  },
  pageExtensions: ['tsx', 'js', 'ts', 'jsx'], // Define allowed file extensions for Next.js pages
};


export default nextConfig;
