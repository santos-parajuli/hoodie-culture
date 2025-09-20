'use client';

import { BarChart3, ChevronRight, CreditCard, HelpCircle, LucideIcon, MessageSquare, Moon, Package, Settings, ShoppingCart, SquareChartGantt, Sun, Tag, User, Users, Warehouse } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { memo, useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

// ---- Types ----
interface NavSubItem {
	title: string;
	href: string;
}
interface NavItem {
	title: string;
	icon: LucideIcon;
	href: string;
	items?: NavSubItem[];
}

// ---- Navigation ----
const navMain: NavItem[] = [
	{
		title: 'Dashboard',
		icon: BarChart3,
		href: '/admin',
		items: [
			{ title: 'Overview', href: '/admin' },
			{ title: 'Analytics', href: '/admin/analytics' },
			{ title: 'Reports', href: '/admin/reports' },
		],
	},
	{
		title: 'Products',
		icon: Package,
		href: '/admin/products',
		items: [
			{ title: 'All Products', href: '/admin/products' },
			{ title: 'Add Product', href: '/admin/products/create' },
		],
	},
	{
		title: 'Categories',
		icon: SquareChartGantt,
		href: '/admin/categories',
		items: [
			{ title: 'All Categories', href: '/admin/categories' },
			{ title: 'Add Categories', href: '/admin/categories/create' },
		],
	},
	{
		title: 'Orders',
		icon: ShoppingCart,
		href: '/admin/orders',
	},
	{
		title: 'Customers',
		icon: Users,
		href: '/admin/customers',
		items: [
			{ title: 'All Customers', href: '/admin/customers' },
			{ title: 'Reviews', href: '/customers/reviews' },
		],
	},
	{
		title: 'Settings',
		icon: Settings,
		href: '/admin/settings',
		items: [
			{ title: 'General', href: '/admin/settings/general' },
			{ title: 'Payment', href: '/admin/settings/payment' },
			{ title: 'Shipping', href: '/admin/settings/shipping' },
			{ title: 'Taxes', href: '/admin/settings/taxes' },
		],
	},
];

const navSecondary: NavItem[] = [
	{ title: 'Support', icon: HelpCircle, href: '/support' },
	{ title: 'Feedback', icon: MessageSquare, href: '/feedback' },
];

const projects: NavItem[] = [
	{ title: 'Inventory Management', icon: Warehouse, href: '/admin/inventory' },
	{ title: 'Payment Processing', icon: CreditCard, href: '/admin/settings/payment' },
	{ title: 'Promotions', icon: Tag, href: '/admin/promotions' },
];

// ---- Collapsible Menu ----
function CollapsibleMenuItem({ item, openItem, setOpenItem, isCollapsed }: { item: NavItem; openItem: string | null; setOpenItem: (key: string | null) => void; isCollapsed: boolean }) {
	const pathname = usePathname();
	const Icon = item.icon;
	const [popoverOpen, setPopoverOpen] = useState(false);
	const open = openItem === item.href;

	if (isCollapsed && item.items) {
		return (
			<SidebarMenuItem>
				<TooltipProvider delayDuration={200}>
					<Tooltip>
						<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
							<TooltipTrigger asChild>
								<PopoverTrigger asChild>
									<SidebarMenuButton aria-label={item.title} title={item.title}>
										<Icon className='h-5 w-5' />
										<span className='sr-only'>{item.title}</span>
									</SidebarMenuButton>
								</PopoverTrigger>
							</TooltipTrigger>
							<TooltipContent side='right'>{item.title}</TooltipContent>
							<PopoverContent side='right' align='start' className='w-56 p-1' onEscapeKeyDown={() => setPopoverOpen(false)} onPointerDownOutside={() => setPopoverOpen(false)}>
								<SidebarMenu className='mt-1'>
									{item.items.map((sub) => {
										const isActive = pathname === sub.href;
										return (
											<SidebarMenuItem key={sub.href}>
												<SidebarMenuButton asChild>
													<Link href={sub.href} prefetch={false} onClick={() => setPopoverOpen(false)} className={isActive ? 'font-semibold text-primary' : ''}>
														{sub.title}
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										);
									})}
								</SidebarMenu>
							</PopoverContent>
						</Popover>
					</Tooltip>
				</TooltipProvider>
			</SidebarMenuItem>
		);
	}

	return (
		<SidebarMenuItem>
			<SidebarMenuButton onClick={() => setOpenItem(open ? null : item.href)}>
				<Icon className='h-5 w-5' />
				<span>{item.title}</span>
				<ChevronRight className={`ml-auto h-4 w-4 transition-transform ${open ? 'rotate-90' : ''}`} />
			</SidebarMenuButton>
			{open && item.items && (
				<SidebarMenu className='ml-6 mt-1 space-y-1 border-l pl-3 text-sm'>
					{item.items.map((sub) => {
						const isActive = pathname === sub.href;
						return (
							<SidebarMenuItem key={sub.href}>
								<SidebarMenuButton asChild>
									<Link href={sub.href} prefetch={false} className={isActive ? 'font-semibold text-primary' : ''}>
										{sub.title}
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			)}
		</SidebarMenuItem>
	);
}

// ---- Admin Sidebar ----
export const AdminSidebar = memo(() => {
	const { state } = useSidebar();
	const pathname = usePathname();
	const [openItem, setOpenItem] = useState<string | null>(null);

	// Mounted flag for client-only rendering
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	const isCollapsed = state === 'collapsed';

	return (
		<Sidebar collapsible='icon' className='overflow-x-hidden'>
			{/* Header */}
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size='lg' asChild>
							<Link href='/admin' prefetch={false}>
								<div className='bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
									<Image src='/logo.svg' alt='CloudHood Logo' width={20} height={20} />
								</div>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-semibold'>Cloud Hood</span>
									<span className='truncate text-xs'>Admin Panel</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			{/* Navigation */}
			<SidebarContent className='overflow-x-hidden'>
				{/* Main */}
				<SidebarGroup>
					<SidebarGroupLabel>Main</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navMain.map((item) =>
								item.items ? (
									<CollapsibleMenuItem key={item.href} item={item} openItem={openItem} setOpenItem={setOpenItem} isCollapsed={isCollapsed} />
								) : (
									<SidebarMenuItem key={item.href}>
										<TooltipProvider delayDuration={200}>
											<Tooltip>
												<TooltipTrigger asChild>
													<SidebarMenuButton asChild>
														<Link href={item.href} prefetch={false} className={pathname === item.href ? 'font-semibold text-primary' : ''}>
															<item.icon className='h-5 w-5' />
															<span>{item.title}</span>
														</Link>
													</SidebarMenuButton>
												</TooltipTrigger>
												{isCollapsed && <TooltipContent side='right'>{item.title}</TooltipContent>}
											</Tooltip>
										</TooltipProvider>
									</SidebarMenuItem>
								)
							)}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Projects */}
				<SidebarGroup>
					<SidebarGroupLabel>Projects</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{projects.map((item) => {
								const Icon = item.icon;
								const isActive = pathname === item.href;
								return (
									<SidebarMenuItem key={item.href}>
										<TooltipProvider delayDuration={200}>
											<Tooltip>
												<TooltipTrigger asChild>
													<SidebarMenuButton asChild>
														<Link href={item.href} prefetch={false} className={isActive ? 'font-semibold text-primary' : ''}>
															<Icon className='h-5 w-5' />
															<span>{item.title}</span>
														</Link>
													</SidebarMenuButton>
												</TooltipTrigger>
												{isCollapsed && <TooltipContent side='right'>{item.title}</TooltipContent>}
											</Tooltip>
										</TooltipProvider>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Secondary */}
				<SidebarGroup>
					<SidebarGroupLabel>More</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navSecondary.map((item) => {
								const Icon = item.icon;
								const isActive = pathname === item.href;
								return (
									<SidebarMenuItem key={item.href}>
										<TooltipProvider delayDuration={200}>
											<Tooltip>
												<TooltipTrigger asChild>
													<SidebarMenuButton asChild>
														<Link href={item.href} prefetch={false} className={isActive ? 'font-semibold text-primary' : ''}>
															<Icon className='h-5 w-5' />
															<span>{item.title}</span>
														</Link>
													</SidebarMenuButton>
												</TooltipTrigger>
												{isCollapsed && <TooltipContent side='right'>{item.title}</TooltipContent>}
											</Tooltip>
										</TooltipProvider>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			{/* Footer */}
			{mounted && (
				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
								{theme === 'dark' ? <Sun /> : <Moon />}
								<span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href='/admin/profile' prefetch={false}>
									<User />
									<span>Admin Profile</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			)}

			<SidebarRail />
		</Sidebar>
	);
});

AdminSidebar.displayName = 'AdminSidebar';
