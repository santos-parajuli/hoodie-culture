import Image from 'next/image';
import Link from 'next/link';

export function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
	return (
		<div className='flex flex-col items-center gap-2 text-center'>
			<div className='flex justify-center gap-2 md:justify-start'>
				<Link href='/' className='flex items-center gap-2 font-medium'>
					<Image src='/logo.svg' alt='CloudHood Logo' width={32} height={32} className='h-6 w-auto' />
					Cloud Hood
				</Link>
			</div>
			<h1 className='text-2xl font-bold'>{title}</h1>
			<p className='text-muted-foreground text-sm'>{subtitle}</p>
		</div>
	);
}
