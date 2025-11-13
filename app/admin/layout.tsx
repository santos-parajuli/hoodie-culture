import { AdminDashboardHeader } from '@/components/admin/sidebar/admin-header';
import { AdminSidebar } from '@/components/admin/sidebar/admin-sidebar';
// app/admin/layout.tsx
import { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: ReactNode }) {
	const session = await auth();

	if (!session) {
		const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/admin';
		redirect(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
	} else if ((session.user as { role: string }).role !== 'admin') {
		redirect(`/`);
	}
	return (
		<div className=' bg-background [--header-height:calc(--spacing(14))]'>
			<SidebarProvider className='flex flex-col '>
				<div className='flex flex-1'>
					<AdminSidebar />
					<div className='flex flex-col w-full'>
						<AdminDashboardHeader />

						{children}
					</div>
				</div>
			</SidebarProvider>
		</div>
	);
}
