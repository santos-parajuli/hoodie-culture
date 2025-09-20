'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { CategoryAPI, ProductsAPI } from '@/lib/api';
import { CategoryInterface, ProductInterface } from '@/utils/types/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarInset, SidebarProvider, SidebarTriggerFilter } from '@/components/ui/sidebar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProductCard from '@/components/client/product-card';
import ProductCardSkeleton from '@/components/shared/skeletons/product-card-skeleton';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { debounce } from '@/utils/helpers/debounce';
import { toast } from 'sonner';

const PRODUCTS_PER_PAGE = 8;

interface ProductsClientProps {
	initialCategory?: string;
}

// -------------------- Search Box --------------------
function SearchBox({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
	return <Input placeholder='Search products...' value={value} onChange={onChange} className='flex-1 max-w-sm' />;
}

// -------------------- Breadcrumb Header --------------------
function BreadcrumbHeader({ crumbs, searchInput, handleSearchChange }: { crumbs: string[]; searchInput: string; handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
	return (
		<header className='flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4'>
			<div className='flex items-center'>
				<SidebarTriggerFilter className='-ml-2' />
				<Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4 hidden md:block' />
				<Breadcrumb className='hidden md:block'>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbPage>All Products</BreadcrumbPage>
						</BreadcrumbItem>
						{crumbs.map((c, idx) => (
							<span key={idx} className='flex items-center'>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbPage>{c}</BreadcrumbPage>
								</BreadcrumbItem>
							</span>
						))}
					</BreadcrumbList>
				</Breadcrumb>
				<Separator orientation='vertical' className='ml-2 data-[orientation=vertical]:h-4' />
			</div>
			<div className='flex items-center'>
				<SearchBox value={searchInput} onChange={handleSearchChange} />
			</div>
		</header>
	);
}

// -------------------- Main Products Client --------------------
export default function ProductsClient({ initialCategory = '' }: ProductsClientProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	// -------------------- Filters & Pagination --------------------
	const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || searchParams?.get('category') || '');
	const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'rating'>('latest');
	const [searchQuery, setSearchQuery] = useState('');
	const [searchInput, setSearchInput] = useState('');
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
	const [minRating, setMinRating] = useState<number>(0);
	const [skip, setSkip] = useState(0);

	// -------------------- Data --------------------
	const [products, setProducts] = useState<ProductInterface[]>([]);
	const [categories, setCategories] = useState<CategoryInterface[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [hasMore, setHasMore] = useState(true);

	// -------------------- Sync URL category --------------------
	useEffect(() => {
		const cat = searchParams?.get('category') || '';
		if (cat !== selectedCategory) {
			setSelectedCategory(cat);
			setSkip(0); // reset pagination
		}
	}, [searchParams, selectedCategory]);

	// -------------------- Filter Params --------------------
	const filterParams = useMemo(
		() => ({
			categoryId: selectedCategory || undefined,
			sort: sortBy,
			search: searchQuery || undefined,
			minPrice: priceRange[0],
			maxPrice: priceRange[1],
			minRating,
		}),
		[selectedCategory, sortBy, searchQuery, priceRange, minRating]
	);

	// -------------------- Fetch Products --------------------
	const fetchProducts = useCallback(
		async (reset = false) => {
			setLoading(true);
			setError(null);
			try {
				const data = await ProductsAPI.getProducts({
					limit: PRODUCTS_PER_PAGE,
					skip: reset ? 0 : skip,
					...filterParams,
				});

				const newProducts = data.products;

				setProducts((prev) => (reset ? newProducts : [...prev, ...newProducts]));
				setHasMore(newProducts.length === PRODUCTS_PER_PAGE);
			} catch (err: unknown) {
				const msg = err instanceof Error ? err.message : 'Failed to fetch products';
				setError(msg);
				toast.error(msg);
			} finally {
				setLoading(false);
			}
		},
		[filterParams, skip]
	);

	// -------------------- Filters change → reset products --------------------
	useEffect(() => {
		setSkip(0);
		setProducts([]);
		fetchProducts(true);
	}, [fetchProducts, filterParams]); // runs when filters change

	// -------------------- Pagination --------------------
	useEffect(() => {
		if (skip > 0) {
			fetchProducts();
		}
	}, [fetchProducts, skip]);

	// -------------------- Categories --------------------
	useEffect(() => {
		CategoryAPI.getCategories()
			.then(setCategories)
			.catch(() => toast.error('Failed to load categories.'));
	}, []);

	// -------------------- Search --------------------
	const debouncedSearch = useMemo(
		() =>
			debounce((val: string) => {
				setSkip(0);
				setSearchQuery(val);
			}, 500),
		[]
	);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInput(e.target.value);
		debouncedSearch(e.target.value);
	};

	// -------------------- Reset Filters --------------------
	const handleResetFilters = () => {
		setSelectedCategory('');
		setSortBy('latest');
		setSearchQuery('');
		setSearchInput('');
		setPriceRange([0, 100]);
		setMinRating(0);
		setSkip(0);

		// Clear category query from URL
		const params = new URLSearchParams(window.location.search);
		params.delete('category');
		router.replace(`${window.location.pathname}?${params.toString()}`);
	};

	// -------------------- Sidebar Filters --------------------
	const SidebarFilters = () => (
		<SidebarContent>
			<SidebarGroup>
				<SidebarGroupLabel>Filters</SidebarGroupLabel>
				<div className='space-y-6 p-4'>
					{/* Category */}
					<div>
						<Label className='mb-2 block'>Category</Label>
						<Select
							value={selectedCategory}
							onValueChange={(val) => {
								setSelectedCategory(val);
								setSkip(0);
								// update URL
								const params = new URLSearchParams(window.location.search);
								if (val === '' || val === 'all') params.delete('category');
								else params.set('category', val);
								router.replace(`${window.location.pathname}?${params.toString()}`);
							}}>
							<SelectTrigger className='w-full'>
								<SelectValue placeholder='All Categories' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>All Categories</SelectItem>
								{categories.map((cat) => (
									<SelectItem key={cat.id} value={cat.id}>
										{cat.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Sort */}
					<div>
						<Label className='mb-2 block'>Sort</Label>
						<Select value={sortBy} onValueChange={(val) => setSortBy(val as 'latest' | 'popular' | 'rating')}>
							<SelectTrigger className='w-full'>
								<SelectValue placeholder='Sort By' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='latest'>Latest</SelectItem>
								<SelectItem value='popular'>Popular</SelectItem>
								<SelectItem value='rating'>Top Rated</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Price Range */}
					<div>
						<Label className='mb-2 block'>Price Range</Label>
						<div className='flex items-center gap-2'>
							<span className='text-sm'>{priceRange[0]}</span>
							<Slider value={priceRange} min={0} max={100} step={1} onValueChange={(val) => setPriceRange(val as [number, number])} className='w-full' />
							<span className='text-sm'>{priceRange[1]}</span>
						</div>
					</div>

					{/* Min Rating */}
					<div>
						<Label className='mb-2 block'>Min Rating</Label>
						<div className='flex items-center gap-2'>
							<span className='text-sm'>{minRating}</span>
							<Slider value={[minRating]} min={0} max={5} step={0.1} onValueChange={(val) => setMinRating(val[0])} className='w-full' />
						</div>
					</div>

					<Button variant='outline' onClick={handleResetFilters}>
						Reset Filters
					</Button>
				</div>
			</SidebarGroup>
		</SidebarContent>
	);

	// -------------------- Breadcrumbs --------------------
	const crumbs: string[] = [];
	if (selectedCategory && selectedCategory !== 'all') {
		const category = categories.find((c) => c.id === selectedCategory)?.name || selectedCategory;
		crumbs.push(`Category: ${category}`);
	}
	if (sortBy && sortBy !== 'latest') crumbs.push(`Sort: ${sortBy}`);
	if (searchQuery) crumbs.push(`Search: "${searchQuery}"`);
	if (priceRange[0] > 0 || priceRange[1] < 100) crumbs.push(`Price: ${priceRange[0]}-${priceRange[1]}`);
	if (minRating > 0) crumbs.push(`Min Rating: ${minRating}`);

	// -------------------- Render --------------------
	return (
		<div className='h-full'>
			<SidebarProvider className='bg-transparent'>
				<Sidebar collapsible='offcanvas' variant='sidebar' className='pt-16'>
					<SidebarFilters />
				</Sidebar>
				<SidebarInset>
					<BreadcrumbHeader crumbs={crumbs} searchInput={searchInput} handleSearchChange={handleSearchChange} />
					<div className='p-4'>
						<main className='flex-1'>
							<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8'>
								{products.map((p) => (
									<ProductCard key={p.id} product={p} />
								))}

								{loading && Array.from({ length: PRODUCTS_PER_PAGE }).map((_, idx) => <ProductCardSkeleton key={`skeleton-${idx}`} />)}
							</div>

							{!loading && hasMore && products.length > 0 && (
								<div className='text-center mt-8'>
									<Button onClick={() => setSkip((s) => s + PRODUCTS_PER_PAGE)}>Load More</Button>
								</div>
							)}

							{!loading && products.length === 0 && !error && <div className='text-center mt-8 text-gray-600 py-12'>No products found. Try adjusting your filters.</div>}

							{error && <div className='text-center text-red-600 mt-4'>{error}</div>}
						</main>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
