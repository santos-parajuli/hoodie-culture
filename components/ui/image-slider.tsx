/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { AnimatePresence, motion } from 'motion/react';
import React, { ReactNode, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface ImagesSliderProps {
	images: string[];
	children?: ReactNode;
	overlay?: boolean;
	overlayClassName?: string;
	className?: string;
	autoplay?: boolean;
	direction?: 'up' | 'down';
}

export const ImagesSlider: React.FC<ImagesSliderProps> = ({ images, children, overlay = true, overlayClassName, className, autoplay = true, direction = 'up' }) => {
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [loadedImages, setLoadedImages] = useState<string[]>([]);

	const handleNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1 === images.length ? 0 : prevIndex + 1));
	};

	const handlePrevious = () => {
		setCurrentIndex((prevIndex) => (prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1));
	};

	useEffect(() => {
		loadImages();
	}, []);

	const loadImages = () => {
		setLoading(true);
		const loadPromises = images.map(
			(image) =>
				new Promise<string>((resolve, reject) => {
					const img = new Image();
					img.src = image;
					img.onload = () => resolve(image);
					img.onerror = () => reject(`Failed to load image: ${image}`);
				})
		);

		Promise.all(loadPromises)
			.then((loaded) => {
				setLoadedImages(loaded);
				setLoading(false);
			})
			.catch((error) => console.error(error));
	};

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'ArrowRight') handleNext();
			else if (event.key === 'ArrowLeft') handlePrevious();
		};
		window.addEventListener('keydown', handleKeyDown);
		let interval: number | undefined;
		if (autoplay) {
			interval = window.setInterval(() => {
				handleNext();
			}, 5000);
		}
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			if (interval) clearInterval(interval);
		};
	}, [autoplay, images.length]);

	const slideVariants = {
		initial: (direction: 'up' | 'down') => ({
			y: direction === 'up' ? 50 : -50,
			opacity: 0,
			scale: 0.95,
		}),
		visible: {
			y: 0,
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.6,
				ease: [0.645, 0.045, 0.355, 1.0] as [number, number, number, number], // <-- force tuple type
			},
		},
		exit: (direction: 'up' | 'down') => ({
			y: direction === 'up' ? -50 : 50,
			opacity: 0,
			scale: 0.95,
			transition: {
				duration: 0.5,
				ease: [0.645, 0.045, 0.355, 1.0] as [number, number, number, number],
			},
		}),
	};

	const areImagesLoaded = loadedImages.length > 0;

	return (
		<div className={cn('overflow-hidden h-full w-full relative flex items-center justify-center', className)} style={{ perspective: '1000px' }}>
			{areImagesLoaded && children}
			{areImagesLoaded && overlay && <div className={cn('absolute inset-0 bg-foreground/20 dark:bg-background/60 z-40', overlayClassName)} />}

			{areImagesLoaded && (
				<AnimatePresence>
					<motion.img
						key={currentIndex}
						src={loadedImages[currentIndex]}
						initial='initial'
						animate='visible'
						exit='exit'
						variants={slideVariants}
						custom={direction} // ✅ pass direction for function variants
						className='image h-full w-full absolute inset-0 object-cover object-center'
					/>
				</AnimatePresence>
			)}
		</div>
	);
};
