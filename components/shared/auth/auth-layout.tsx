'use client';

import Image from 'next/image';

export function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='grid min-h-screen max-h-screen w-full lg:grid-cols-2'>
			{/* Form side */}
			<div className='flex flex-col gap-4 p-10 md:p-15'>
				<div className='flex flex-1 items-center justify-center'>{children}</div>
			</div>
			{/* Image side */}
			<div className='bg-muted relative hidden lg:block'>
				<Image src='/image.png' alt='Authentication illustration' width={500} height={800} className='h-[100vh] w-full object-cover' />
			</div>
		</div>
	);
}
