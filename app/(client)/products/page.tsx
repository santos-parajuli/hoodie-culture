/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductsClient from '@/components/client/pages/products-client';
import { Suspense } from 'react';

export default async function ProductsPage({ params }: any) {
	const { searchParams } = await params;
	return (
		<Suspense fallback={null}>
			<ProductsClient initialCategory={searchParams?.category} />
		</Suspense>
	);
}
