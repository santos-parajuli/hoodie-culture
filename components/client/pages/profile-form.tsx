'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ImageInterface, UserInterface } from '@/utils/types/types';

import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/shared/ImageUpload';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const profileFormSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	email: z.string().email(),
});

export default function ProfileForm({ user }: { user: UserInterface }) {
	const router = useRouter();
	const { update } = useSession();
	const [image, setImage] = useState<ImageInterface | null>(user.image ? { url: user.image } : null);

	const form = useForm({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			name: user.name || '',
			email: user.email || '',
		},
	});
	const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
		const updatePromise = apiClient('/api/profile', {
			method: 'PUT',
			body: JSON.stringify({ name: values.name, image: image?.url }),
		});
		toast.promise(updatePromise, {
			loading: 'Updating profile...',
			success: async () => {
				await update();
				router.refresh();
				return 'Profile updated successfully!';
			},
			error: (err) => err.message || 'Failed to update profile',
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Edit Profile</CardTitle>
				<CardDescription>Update your profile information.</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<FormItem>
							<FormLabel>Profile Picture</FormLabel>
							<FormControl>
								<ImageUpload initialImages={image ? [image] : []} onUpload={(imgs) => setImage(imgs[0] ?? null)} maxFiles={1} />
							</FormControl>
							<FormMessage />
						</FormItem>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} readOnly disabled />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit' disabled={form.formState.isSubmitting}>
							Save Changes
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
