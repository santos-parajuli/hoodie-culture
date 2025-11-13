import NavBar from '@/components/client/nav-bar/nav-bar';
import { SessionProvider } from 'next-auth/react';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<NavBar />
			<main>{children}</main>
		</SessionProvider>
	);
}
