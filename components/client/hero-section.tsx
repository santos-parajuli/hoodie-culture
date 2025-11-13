'use client';

import { ImagesSlider } from '@/components/ui/image-slider';
import Link from 'next/link';
import React from 'react';
import { motion } from 'motion/react';

export default function Hero() {
	const images = [
		'https://images.unsplash.com/photo-1579269896398-4deb6cbdc320?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		'https://images.unsplash.com/photo-1732257119998-b66cda63dcfc?q=80&w=3130&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		'https://images.unsplash.com/photo-1566778938552-2af3eb48016d?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	];
	return (
		<ImagesSlider className='h-[50rem]' images={images}>
			<motion.div className='z-50 flex flex-col justify-center items-center px-4 text-center' initial={{ opacity: 0, y: -80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
				{/* Heading */}
				<motion.h1 className='font-bold text-4xl md:text-6xl py-4 text-white dark:text-gray-100 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]'>Chill. Lounge. CloudHood</motion.h1>

				{/* Subheading */}
				<motion.p className='capitalize text-lg md:text-2xl py-4 text-white dark:text-gray-200 drop-shadow-[0_0_10px_rgba(0,0,0,0.4)]'>Experience the ultimate in comfort and style with hoodies that feel as soft as a cloud.</motion.p>

				{/* CTA Button */}
				<Link href='/products' target='_blank' rel='noopener noreferrer' className='cursor-pointer'>
					<button className='px-6 py-3 rounded-full bg-white/90 dark:bg-gray-800/80 text-gray-900 dark:text-white font-semibold backdrop-blur-md border border-gray-300 dark:border-gray-600 hover:bg-white/100 dark:hover:bg-gray-800/100 transition'>
						Shop Now →
					</button>
				</Link>
			</motion.div>
		</ImagesSlider>
	);
}
