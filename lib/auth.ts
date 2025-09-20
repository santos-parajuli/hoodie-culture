import { UserInterface, serializeUser } from '@/utils/types/types';
import { clientPromise, dbConnect } from './db';

import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth from 'next-auth';
import User from '@/utils/models/User';
import bcrypt from 'bcrypt';

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: MongoDBAdapter(clientPromise),
	session: {
		strategy: 'jwt',
	},
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) return null;

				const { email, password } = credentials as { email: string; password: string };
				await dbConnect();

				const user = await User.findOne({ email });
				if (!user) return null;

				const isValid = await bcrypt.compare(password, user.passwordHash);
				if (!isValid) return null;
				return serializeUser(user);
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_ID!,
			clientSecret: process.env.GOOGLE_SECRET!,
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				const u = user as UserInterface;
				token.role = u.role;
				token.id = u.id;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.role = token.role;
			}
			return session;
		},
	},
});
