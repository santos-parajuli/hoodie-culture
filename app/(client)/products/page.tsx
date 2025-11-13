/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductsClient from '@/components/client/pages/products-client';

export default async function ProductsPage({ params }: any) {
	const { searchParams } = await params;
	return <ProductsClient initialCategory={searchParams?.category} />;
}
