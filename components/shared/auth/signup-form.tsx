'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { AuthAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { PasswordInput } from '@/components/ui/password-input';
import { signIn } from 'next-auth/react';
import { signupSchema } from '@/utils/validations';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = signupSchema;

export default function SignupForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			setIsLoading(true);
			const user = await AuthAPI.register(values);
			if (!user) {
				toast.error('Failed to register');
				return;
			}
			const result = await signIn('credentials', {
				redirect: false,
				email: values.email,
				password: values.password,
			});
			if (result?.error) {
				toast.error(result.error);
			} else {
				toast.success('Account created successfully!');
				router.push('/');
			}
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
				{/* Name */}
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder='John Doe' disabled={isLoading} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* Email */}
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type='email' placeholder='johndoe@mail.com' disabled={isLoading} {...field} />
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
							<FormLabel>Password</FormLabel>
							<FormControl>
								<PasswordInput placeholder='******' disabled={isLoading} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* Confirm Password */}
				<FormField
					control={form.control}
					name='confirmPassword'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm Password</FormLabel>
							<FormControl>
								<PasswordInput placeholder='******' disabled={isLoading} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* Buttons */}
				<Button type='submit' className='w-full' disabled={isLoading}>
					{isLoading ? 'Signing up...' : 'Sign Up'}
				</Button>
				<Button type='button' variant='outline' className='w-full' onClick={() => signIn('google')} disabled={isLoading}>
					Sign Up with Google
				</Button>
				<div className='mt-4 text-center text-sm'>
					Already have an account?{' '}
					<Link href='/login' className='underline'>
						Login
					</Link>
				</div>
			</form>
		</Form>
	);
}
