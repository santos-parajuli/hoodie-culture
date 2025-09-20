'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Menu as MenuIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface MenuItem {
	title: string;
	href?: string;
	submenu?: { title: string; href: string }[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MobileMenu = ({ menuItems, session, status }: { menuItems: MenuItem[]; session: any; status: string }) => (
	<div className='lg:hidden flex items-center gap-3'>
		<Sheet>
			<SheetTrigger asChild>
				<Button variant='outline' size='icon'>
					<MenuIcon className='w-6 h-6' />
				</Button>
			</SheetTrigger>
			<SheetContent className='flex p-4 overflow-y-auto'>
				<SheetHeader>
					<SheetTitle>
						<Link href='/' className='flex items-center gap-2'>
							<Image src='/logo.svg' alt='CloudHood Logo' width={32} height={32} className='h-8' />
							<span className='font-semibold text-lg'>Cloud Hood</span>
						</Link>
					</SheetTitle>
				</SheetHeader>

				<div className='flex flex-col gap-4 mt-4'>
					{menuItems.map((item, idx) =>
						item.submenu ? (
							<Accordion key={idx} type='single' collapsible>
								<AccordionItem value={item.title}>
									<AccordionTrigger className='text-md font-semibold py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'>{item.title}</AccordionTrigger>
									<AccordionContent className='flex flex-col gap-2 pl-2'>
										{item.submenu.map((sub) => (
											<Link key={sub.title} href={sub.href} className='py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'>
												{sub.title}
											</Link>
										))}
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						) : (
							<Link key={idx} href={item.href!} className='text-md font-semibold py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'>
								{item.title}
							</Link>
						)
					)}

					{/* Auth / Theme Toggle */}
					<div className='flex flex-col gap-3 mt-4'>
						{status === 'loading' ? null : session ? (
							<div className='flex flex-col gap-2'>
								<Link href='/profile' className='py-1 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'>
									Profile
								</Link>
								<Link href='/orders' className='py-1 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'>
									Orders
								</Link>
								<button onClick={() => signOut()} className='py-1 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-left'>
									Sign Out
								</button>
							</div>
						) : (
							<Link href='/login' className='py-1 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'>
								Log In
							</Link>
						)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	</div>
);
