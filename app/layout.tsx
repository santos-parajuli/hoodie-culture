import './globals.css';

import { Rubik, Rubik_Mono_One } from 'next/font/google';

import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';

const rubik = Rubik({
	variable: '--font-rubik',
	subsets: ['latin'],
});

const rubikMono = Rubik_Mono_One({
	variable: '--font-rubik-mono',
	weight: '400',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Hoodie Culture – Oversized Comfy Hoodies',
	description: 'Hoodie Culture brings you oversized, ultra-comfy hoodies designed for everyday comfort and style.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${rubik.variable} ${rubikMono.variable} antialiased bg-background text-accent-foreground`}>
				<ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
					{children}
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
