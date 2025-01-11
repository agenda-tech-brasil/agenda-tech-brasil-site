/** @type {import('next').NextConfig} */
const nextConfig = {
  //  eslint: {
  //   ignoreDuringBuilds: process.env.NEXT_PUBLIC_DISABLE_ESLINT === 'true',
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',  // ✅ Define o protocolo
        hostname: 'i.ibb.co',  // ✅ Define o domínio
      },
    ],
  },
};

export default nextConfig;
