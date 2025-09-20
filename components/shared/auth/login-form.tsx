'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { PasswordInput } from '@/components/ui/password-input';
import { loginSchema } from '@/utils/validations';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = loginSchema;

export default function LoginForm() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl') || '/';

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { email: '', password: '' },
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setIsLoading(true);
			const result = await signIn('credentials', {
				...values,
				redirect: false,
				callbackUrl,
			});
			if (result?.error) {
				toast.error(result.error || 'Invalid credentials');
			} else {
				toast.success('Signed in successfully');
				router.push(result?.url || callbackUrl);
			}
		} catch (error) {
			toast.error('Failed to login. Please try again.');
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
				{/* Email */}
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type='email' placeholder='johndoe@mail.com' autoComplete='email' disabled={isLoading} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* Password */}
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<div className='flex justify-between items-center'>
								<FormLabel>Password</FormLabel>
								<Link href='/request-password-reset' className='ml-auto inline-block text-sm underline'>
									Forgot your password?
								</Link>
							</div>
							<FormControl>
								<PasswordInput placeholder='******' autoComplete='current-password' disabled={isLoading} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* Buttons */}
				<Button type='submit' className='w-full' disabled={isLoading}>
					{isLoading ? 'Logging in...' : 'Login'}
				</Button>
				<Button type='button' variant='outline' className='w-full' disabled={isLoading} onClick={() => signIn('google', { callbackUrl })}>
					Login with Google
				</Button>
				<div className='mt-4 text-center text-sm'>
					Don&apos;t have an account?{' '}
					<Link href='/signup' className='underline'>
						Sign up
					</Link>
				</div>
			</form>
		</Form>
	);
}
