'use client';

import { BarChart3, LucideIcon, Package, Settings, ShoppingCart, Users } from 'lucide-react';
import { Bell, Download, MoreHorizontal, RefreshCw, Search } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { memo } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

// Map route segments to icons
const breadcrumbIcons: Record<string, LucideIcon> = {
	admin: BarChart3,
	products: Package,
	orders: ShoppingCart,
	customers: Users,
	settings: Settings,
};

export const AdminDashboardHeader = memo(() => {
	const pathname = usePathname();

	const pathSegments = pathname?.split('/').filter(Boolean) || [];
	const breadcrumbItems = pathSegments.map((seg, index) => {
		const href = '/' + pathSegments.slice(0, index + 1).join('/');
		const title = seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
		const Icon = breadcrumbIcons[seg.toLowerCase()] || null;
		const isLast = index === pathSegments.length - 1;
		return { href, title, Icon, isLast };
	});

	return (
		<header className='bg-background/95 sticky top-0 z-50 flex h-16 w-full shrink-0 items-center gap-2 border-b backdrop-blur transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
			<div className='flex items-center gap-2 px-4'>
				<SidebarTrigger className='-ml-1' />
				<Separator orientation='vertical' className='mr-2 h-4' />
				<Breadcrumb>
					<BreadcrumbList className='flex items-center gap-1'>
						<BreadcrumbItem>
							<BreadcrumbLink href='/'>Home</BreadcrumbLink>
						</BreadcrumbItem>
						{breadcrumbItems.map((item) => (
							<BreadcrumbItem key={item.href} className='flex items-center gap-1'>
								<span className='text-muted-foreground'>{'>'}</span>
								<BreadcrumbLink href={item.href} className={`flex items-center gap-1 ${item.isLast ? 'font-bold text-primary' : ''}`}>
									{item.Icon && <item.Icon className='h-4 w-4' />}
									<span>{item.title}</span>
								</BreadcrumbLink>
							</BreadcrumbItem>
						))}
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			<div className='ml-auto flex items-center gap-2 px-4'>
				<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className='flex items-center gap-2'>
					<div className='relative hidden md:block'>
						<Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
						<Input placeholder='Search...' className='w-64 pl-10' />
					</div>

					<div className='hidden items-center gap-2 md:flex'>
						<Button variant='outline' size='sm'>
							<Download className='mr-2 h-4 w-4' />
							Export
						</Button>
						<Button variant='outline' size='sm'>
							<RefreshCw className='mr-2 h-4 w-4' />
							Refresh
						</Button>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild className='md:hidden'>
							<Button variant='outline' size='icon'>
								<MoreHorizontal className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-48'>
							<DropdownMenuItem>
								<Search className='mr-2 h-4 w-4' />
								Search
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Download className='mr-2 h-4 w-4' />
								Export
							</DropdownMenuItem>
							<DropdownMenuItem>
								<RefreshCw className='mr-2 h-4 w-4' />
								Refresh
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Button variant='outline' size='sm'>
						<Bell className='h-4 w-4' />
					</Button>
				</motion.div>
			</div>
		</header>
	);
});

AdminDashboardHeader.displayName = 'AdminDashboardHeader';
