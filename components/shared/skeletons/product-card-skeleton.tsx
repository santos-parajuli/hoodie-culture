import React from 'react';

function ProductCardSkeleton() {
	return (
		<div className='w-full flex justify-center animate-pulse'>
			<div className='w-full h-full rounded-lg shadow-sm flex flex-col bg-card text-card-foreground'>
				{/* Image */}
				<div className='aspect-square rounded-t-lg bg-gray-200 dark:bg-gray-700' />
				{/* Content */}
				<div className='p-4 flex flex-col flex-grow space-y-2'>
					{/* Title */}
					<div className='h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-600' />
					{/* Description */}
					<div className='h-3 w-full rounded bg-gray-300 dark:bg-gray-600' />
					{/* Bottom section */}
					<div className='mt-auto flex justify-between items-center'>
						<div className='h-4 w-1/4 rounded bg-gray-300 dark:bg-gray-600' />
						<div className='h-6 w-16 rounded bg-gray-300 dark:bg-gray-600' />
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProductCardSkeleton;
