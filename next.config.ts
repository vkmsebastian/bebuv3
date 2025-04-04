import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'media1.tenor.com',
                pathname: '/m/**',
            },
            {
                protocol: 'https',
                hostname: 'i.scdn.co',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
