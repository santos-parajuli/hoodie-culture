import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				pathname: '/**', // allow all paths
			},
			{
				protocol: 'https',
				hostname: 'm.media-amazon.com',
				pathname: '/**',
			},
		],
	},
	transpilePackages: ['three'],
};

export default nextConfig;
