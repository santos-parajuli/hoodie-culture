import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';

import Link from 'next/link';

interface MenuItem {
	title: string;
	href?: string;
	submenu?: { title: string; href: string }[];
}

export const DesktopMenu = ({ menuItems }: { menuItems: MenuItem[] }) => (
	<NavigationMenu className='hidden lg:flex'>
		<NavigationMenuList>
			{menuItems.map((item, idx) => (
				<NavigationMenuItem key={idx}>
					{item.submenu ? (
						<>
							<NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul className='grid w-[200px] gap-2 p-2'>
									{item.submenu.map((sub, i) => (
										<li key={i}>
											<NavigationMenuLink asChild>
												<Link href={sub.href} className='flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700'>
													{sub.title}
												</Link>
											</NavigationMenuLink>
										</li>
									))}
								</ul>
							</NavigationMenuContent>
						</>
					) : (
						<NavigationMenuLink href={item.href!} className={navigationMenuTriggerStyle()}>
							{item.title}
						</NavigationMenuLink>
					)}
				</NavigationMenuItem>
			))}
		</NavigationMenuList>
	</NavigationMenu>
);
