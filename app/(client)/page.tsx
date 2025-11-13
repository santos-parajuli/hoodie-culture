import Hero from '@/components/client/hero-section';
import ProductCard from '@/components/client/product-card';
import { ProductsAPI } from '@/lib/api';
import { Suspense } from 'react';

export default async function Home() {
	const newArrivals = await ProductsAPI.getProducts({ limit: 8, sort: 'latest' });
	return (
		<div>
			<Hero />
			<Suspense fallback={<h1>loading...</h1>}>
				<section className='py-16 bg-background text-foreground'>
					<div className='mx-auto max-w-7xl px-6 lg:px-8'>
						<h2 className='text-3xl font-bold text-center mb-12'>New Arrivals</h2>
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
							{newArrivals.products.map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					</div>
				</section>
			</Suspense>
		</div>
	);
}
