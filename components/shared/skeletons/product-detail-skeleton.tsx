const ProductDetailsSkeleton = () => (
	<div className='container mx-auto p-4 animate-pulse'>
		<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
			{/* Image section */}
			<div className='space-y-4'>
				<div className='relative w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg' />
				<div className='flex gap-2 overflow-x-auto'>
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className='relative w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-lg flex-shrink-0' />
					))}
				</div>
			</div>

			{/* Details section */}
			<div className='space-y-6'>
				{/* Title */}
				<div className='h-8 w-3/4 bg-gray-300 dark:bg-gray-600 rounded' />
				{/* Description */}
				<div className='h-4 w-full bg-gray-300 dark:bg-gray-600 rounded' />
				<div className='h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded' />

				{/* Variant / Size selection */}
				<div className='space-y-2'>
					<div className='h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded' />
					<div className='h-8 w-40 bg-gray-300 dark:bg-gray-600 rounded' />
				</div>

				<div className='space-y-2'>
					<div className='h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded' />
					<div className='h-8 w-40 bg-gray-300 dark:bg-gray-600 rounded' />
				</div>

				{/* Quantity & Add to cart */}
				<div className='h-10 w-32 bg-gray-300 dark:bg-gray-600 rounded' />
			</div>
		</div>
	</div>
);

export default ProductDetailsSkeleton;
