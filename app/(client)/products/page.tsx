import ProductsClient from '@/components/client/pages/products-client';

interface Props {
	searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ProductsPage({ searchParams }: Props) {
	const category = typeof searchParams?.category === 'string' ? searchParams.category : '';

	return <ProductsClient initialCategory={category} />;
}
