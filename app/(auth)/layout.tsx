import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
	const session = await auth();

	if (session?.user) {
		redirect('/');
	}

	return <main>{children}</main>;
}
