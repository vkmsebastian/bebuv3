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
            {
                protocol: 'https',
                hostname: 'media4.giphy.com',
                pathname: '/media/**',
            }
        ],
    },
};

export default nextConfig;
