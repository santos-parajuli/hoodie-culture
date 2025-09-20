import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
// middleware.ts
import { auth } from '@/lib/auth';

// Define protected paths for admin
const adminPaths = ['/admin'];

export async function middleware(req: NextRequest) {
	const url = req.nextUrl.clone();
	const pathname = url.pathname;
	// Get the user session
	const session = await auth();
	console.log(session);
	if ((pathname === '/login' || pathname === '/signup') && session?.user) {
		return NextResponse.redirect(new URL('/', req.url));
	}
	// 2️⃣ Protect admin routes
	if (adminPaths.some((path) => pathname.startsWith(path))) {
		if (!session?.user) {
			// Not logged in → redirect to login
			return NextResponse.redirect(new URL('/login', req.url));
		}

		if (session.user.role !== 'admin') {
			// Logged in but not admin → redirect to homepage
			return NextResponse.redirect(new URL('/', req.url));
		}
	}
	// 3️⃣ Allow all other routes
	return NextResponse.next();
}
// Match all routes (can restrict to specific paths if desired)
export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
