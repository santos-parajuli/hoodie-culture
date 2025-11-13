import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ProfileForm from '@/components/client/pages/profile-form';
import { UserInterface } from '@/utils/types/types';
import { auth } from '@/lib/auth';
import { getInitials } from '@/utils/helpers/getInitials';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
	const session = await auth();
	if (!session?.user) {
		redirect('/login?callbackUrl=/profile');
	}
	const { user } = session;

	return (
		<div className='container mx-auto p-4 md:p-8'>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
				<div className='md:col-span-1'>
					<Card>
						<CardHeader>
							<CardTitle>My Profile</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='flex flex-col items-center space-y-4'>
								<Avatar className='h-32 w-32'>
									<AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
									<AvatarFallback>{getInitials(user)}</AvatarFallback>
								</Avatar>
								<div className='text-center space-y-1'>
									<h2 className='text-2xl font-bold'>{user.name}</h2>
									<p className='text-muted-foreground'>{user.email}</p>
								</div>
							</div>

							<div>
								<h3 className='text-lg font-semibold mb-2'>Order History</h3>
								<p className='text-muted-foreground mb-4'>View your past orders and their status.</p>
								<Button asChild variant='outline' className='w-full'>
									<Link href='/profile/orders'>View Orders</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
				<div className='md:col-span-2'>
					<ProfileForm user={user as UserInterface} />
				</div>
			</div>
		</div>
	);
}
