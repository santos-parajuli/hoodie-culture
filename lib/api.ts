import { CartItemInterface, CategoryInterface, DbUserAddress, ImageInterface, OrderInterface, ProductInterface, ProductVariantInterface } from '@/utils/types/types';

export const apiClient = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
	const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000' : '';
	const res = await fetch(`${baseUrl}${endpoint}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(options?.headers || {}),
		},
	});
	if (!res.ok) {
		const error = await res.json().catch(() => ({}));
		throw new Error(error.message || 'API error');
	}

	return res.json();
};

export const AuthAPI = {
	register: (data: { name: string; email: string; password: string }) =>
		apiClient('/api/auth/register', {
			method: 'POST',
			body: JSON.stringify(data),
		}),
	login: (data: { email: string; password: string }) =>
		apiClient('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify(data),
		}),
};

export const CategoryAPI = {
	getCategories: () =>
		apiClient<CategoryInterface[]>('/api/categories', {
			method: 'GET',
		}),
};
export const ProductsAPI = {
	getProducts: (options?: { limit?: number; skip?: number; sort?: 'latest' | 'popular' | 'rating'; categoryId?: string; search?: string; minPrice?: number; maxPrice?: number; minRating?: number }) => {
		const params = new URLSearchParams();
		if (options?.limit) params.append('limit', options.limit.toString());
		if (options?.skip) params.append('skip', options.skip.toString());
		if (options?.sort) params.append('sort', options.sort);
		if (options?.categoryId) params.append('categoryId', options.categoryId);
		if (options?.search) params.append('search', options.search);
		if (options?.minPrice !== undefined) params.append('minPrice', options.minPrice.toString());
		if (options?.maxPrice !== undefined) params.append('maxPrice', options.maxPrice.toString());
		if (options?.minRating !== undefined) params.append('minRating', options.minRating.toString());
		return apiClient<{ products: ProductInterface[]; total: number }>(`/api/products?${params.toString()}`, { method: 'GET' });
	},
	getProduct: (options?: { slug?: string }) => {
		return apiClient<ProductInterface>(`/api/products/${options?.slug}`, { method: 'GET' });
	},
};
export const OrderAPI = {
	// Create a new order
	createOrder: (data: { items: CartItemInterface[]; shippingAddress?: DbUserAddress; userId: string; total: number }) =>
		apiClient<OrderInterface>('/api/orders', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: { 'Content-Type': 'application/json' },
		}),
	getOrder: (id: string) =>
		apiClient<OrderInterface>(`/api/orders/${id}`, {
			method: 'GET',
		}),
};

export const AdminAPI = {
	getProducts: () => apiClient<ProductInterface[]>('/api/admin/products', { method: 'GET' }),
	getProduct: (id?: string) => apiClient<ProductInterface>(`/api/admin/products/${id}`, { method: 'GET' }),
	deleteProduct: (id: string) =>
		apiClient<{ message: string }>(`/api/admin/products/${id}`, {
			method: 'DELETE',
		}),
	createProduct: (data: { title: string; slug: string; description?: string; price: number; categoryIds?: string[] | null; images: ImageInterface[]; variants: ProductVariantInterface[]; inventory: { stock: number }; aboutItem?: string[] }) =>
		apiClient<ProductInterface>('/api/admin/products', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: { 'Content-Type': 'application/json' },
		}),
	updateProduct: (
		id: string,
		data: {
			title: string;
			slug: string;
			description?: string;
			price: number;
			categoryIds?: string[] | null;
			images: ImageInterface[];
			variants: ProductVariantInterface[];
			inventory: { stock: number };
			aboutItem?: string[];
		}
	) =>
		apiClient<ProductInterface>(`/api/admin/products/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
			headers: { 'Content-Type': 'application/json' },
		}),
	getCategories: () =>
		apiClient<CategoryInterface[]>('/api/admin/categories', {
			method: 'GET',
		}),
	getCategory: (id: string) => apiClient<CategoryInterface>(`/api/admin/categories/${id}`, { method: 'GET' }),
	createCategory: (data: { name: string; slug: string; parentId?: string; image?: ImageInterface }) =>
		apiClient<CategoryInterface>('/api/admin/categories', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: { 'Content-Type': 'application/json' },
		}),
	updateCategory: (
		id: string,
		data: {
			name: string;
			slug: string;
			parentId?: string;
			image?: ImageInterface;
		}
	) =>
		apiClient<CategoryInterface>(`/api/admin/categories/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
			headers: { 'Content-Type': 'application/json' },
		}),
	deleteCategory: (id: string) =>
		apiClient<{ message: string }>(`/api/admin/categories/${id}`, {
			method: 'DELETE',
		}),
};
