'use client';

import { Moon, SunDim } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { flushSync } from 'react-dom';

type Props = {
	className?: string;
};

export const AnimatedThemeToggler = ({ className }: Props) => {
	const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	// Sync state with current theme on mount
	useEffect(() => {
		setIsDarkMode(document.documentElement.classList.contains('dark'));
	}, []);

	const changeTheme = async () => {
		if (!buttonRef.current) return;

		await document.startViewTransition(() => {
			flushSync(() => {
				const dark = document.documentElement.classList.toggle('dark');
				setIsDarkMode(dark);
			});
		}).ready;

		const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
		const y = top + height / 2;
		const x = left + width / 2;

		const right = window.innerWidth - left;
		const bottom = window.innerHeight - top;
		const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

		document.documentElement.animate(
			{
				clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRad}px at ${x}px ${y}px)`],
			},
			{
				duration: 700,
				easing: 'ease-in-out',
				pseudoElement: '::view-transition-new(root)',
			}
		);
	};

	return (
		<button ref={buttonRef} onClick={changeTheme} className={cn('transition-colors duration-300 text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400', className)}>
			{isDarkMode ? <SunDim className='w-6 h-6' /> : <Moon className='w-6 h-6' />}
		</button>
	);
};
