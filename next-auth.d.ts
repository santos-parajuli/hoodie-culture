import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { UserInterface } from '@/utils/types/types';

declare module 'next-auth' {
	interface Session {
		user: {
			id: string;
			name: string;
			email: string;
			role?: string;
		} & DefaultSession['user'];
	}

	interface User extends DefaultUser {
		id: string;
		role?: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string;
		name: string;
		email: string;
		role?: string;
	}
}
