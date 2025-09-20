import ProductDetails from '@/components/client/product-details';
import ProductDetailsSkeleton from '@/components/shared/skeletons/product-detail-skeleton';
import { ProductsAPI } from '@/lib/api';
import { Suspense } from 'react';

interface ProductDetailPageProps {
	params: { slug: string };
}
export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
	try {
		const product = await ProductsAPI.getProduct({ slug: params.slug });
		if (!product) {
			return <div className='text-center text-gray-600 mt-4'>Product not found.</div>;
		}
		return (
			<Suspense fallback={<ProductDetailsSkeleton />}>
				<ProductDetails product={product} />
			</Suspense>
		);
	} catch (err: unknown) {
		return <div className='text-center text-red-500 mt-4'>Error: {err instanceof Error ? err.message : 'Unknown error'}</div>;
	}
}
