'use client';

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';

import Link from 'next/link';
import UserAvatar from '../avatar';
import { signOut } from 'next-auth/react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserMenu = ({ session, status }: any) => {
	if (status === 'loading') return null;
	return session ? (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger className='flex items-center gap-1 rounded-full'>
						<UserAvatar email={session.user?.email} name={session.user?.name} />
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className='flex flex-col w-fit p-1 gap-2'>
							<li>
								<Link href='/profile' className='px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'>
									Profile
								</Link>
							</li>
							<li>
								<Link href='/orders' className='px-3 py-2  text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'>
									Orders
								</Link>
							</li>
							<li>
								<button onClick={() => signOut()} className='text-left px-3 py-2  text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'>
									SignOut
								</button>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	) : (
		<Link href='/login' className='text-sm font-semibold hover:text-indigo-600'>
			Log In
		</Link>
	);
};

export default UserMenu;
