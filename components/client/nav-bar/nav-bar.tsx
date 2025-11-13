'use client';

import { useEffect, useState } from 'react';

import { AnimatedThemeToggler } from '@/components/shared/mode-toggle';
import { CategoryAPI } from '@/lib/api';
import { CategoryInterface } from '@/utils/types/types';
import { DesktopMenu } from './desktop-menu';
import Image from 'next/image';
import Link from 'next/link';
import { MobileMenu } from './mobile-menu';
import { ShoppingCart } from 'lucide-react';
import UserMenu from './user-menu';
import { toast } from 'sonner';
import { useAppStore } from '@/lib/store';
import { useSession } from 'next-auth/react';

// ✅ Hydration hook
function useHasHydrated() {
	const [hydrated, setHydrated] = useState(false);
	useEffect(() => {
		setHydrated(true);
	}, []);
	return hydrated;
}
const NavBar = () => {
	const [categories, setCategories] = useState<CategoryInterface[]>([]);
	const { data: session, status } = useSession();

	const hasHydrated = useHasHydrated(); // ✅
	const cartItemCount = useAppStore((state) => state.getCartItemCount());

	useEffect(() => {
		async function fetchCategories() {
			try {
				const categories = await CategoryAPI.getCategories();
				setCategories(categories);
			} catch (err) {
				toast.error('Failed to load categories.');
				console.error(err);
			}
		}
		fetchCategories();
	}, []);

	const menuItems = [
		{ title: 'Shop', href: '/products' },
		{
			title: 'Categories',
			submenu: categories.map((cat) => ({
				title: cat.name.toUpperCase(),
				href: `/products?category=${cat.id}`, // pass slug as query
			})),
		},
		{ title: 'Customize', href: '/customize' },
	];

	return (
		<section className='sticky top-0 z-50 bg-white dark:bg-gray-950 shadow-sm'>
			<nav className='mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8'>
				<Link href='/' className='flex items-center gap-2'>
					<Image src='/logo.svg' alt='CloudHood Logo' width={32} height={32} className='h-8 w-auto' />
					<span className='font-semibold text-lg text-gray-900 dark:text-gray-100'>Cloud Hood</span>
				</Link>
				<DesktopMenu menuItems={menuItems} />
				<div className='flex flex-row gap-3 md:gap-2 items-center'>
					<AnimatedThemeToggler />
					<Link href='/cart' className='relative'>
						<ShoppingCart className='w-6 h-6' />
						{/* ✅ only render after hydration */}
						{hasHydrated && cartItemCount > 0 && <span className='absolute -top-2 -right-2 rounded-full bg-red-600 px-1 text-xs text-white font-bold'>{cartItemCount > 99 ? '99+' : cartItemCount}</span>}
					</Link>
					<UserMenu session={session} status={status} />
					<MobileMenu menuItems={menuItems} session={session} status={status} />
				</div>
			</nav>
		</section>
	);
};

export default NavBar;
