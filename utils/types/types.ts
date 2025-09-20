// utils/types/db.ts
import { ObjectId } from 'mongodb';

// ---------- Helpers ----------
export function convertId(id: ObjectId): string {
	return id.toString();
}

// ---------- Database Interfaces (Raw Mongo) ----------
export interface DbImage {
	url: string;
	alt?: string;
	public_id?: string;
}

export interface DbSize {
	label: string;
	stock: number;
}

export interface DbVariant {
	colorName: string;
	image: DbImage;
	sizes: DbSize[];
	public_id: string;
}

export interface DbProduct {
	_id: ObjectId;
	title: string;
	slug: string;
	description?: string;
	price: number;
	categoryIds: DbCategory[];
	images: DbImage[];
	variants: DbVariant[];
	stock: number;
	rating: number;
	aboutItem?: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface DbCategory {
	_id: ObjectId;
	name: string;
	slug: string;
	parentId?: DbCategory;
	image?: DbImage;
	createdAt: Date;
	updatedAt: Date;
}

export interface DbUserAddress {
	line1: string;
	line2?: string;
	city?: string;
	state?: string;
	postalCode?: string;
	country?: string;
}

export interface DbUser {
	_id: ObjectId;
	name: string;
	email: string;
	role: 'user' | 'admin';
	passwordHash: string;
	passwordResetToken?: string;
	passwordResetExpires?: Date;
	addresses?: DbUserAddress[];
	orders?: OrderInterface[];
	createdAt: Date;
	updatedAt: Date;
}

export interface DbCartItem {
	productId: ProductInterface;
	variantId?: string;
	qty: number;
	name: string;
	price: number;
	image?: string;
}

export interface DbCart {
	_id: ObjectId;
	userId: ObjectId;
	items: DbCartItem[];
	createdAt: Date;
	updatedAt: Date;
}

export interface DbOrderItem extends DbCartItem {
	price: number;
}

export interface DbOrder {
	_id: ObjectId;
	userId: DbUser;
	items: DbOrderItem[];
	status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
	total: number;
	shippingAddress?: DbUserAddress;
	createdAt: Date;
	updatedAt: Date;
}

// ---------- Serialized Interfaces (For API Response) ----------
export type ImageInterface = DbImage;

export type ProductSizeInterface = DbSize;

export type ProductVariantInterface = DbVariant;

export interface ProductInterface {
	id: string;
	title: string;
	slug: string;
	description?: string;
	price: number;
	categoryIds: CategoryInterface[];
	images: ImageInterface[];
	variants: ProductVariantInterface[];
	stock: number;
	rating: number;
	aboutItem?: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface CategoryInterface {
	id: string;
	name: string;
	slug: string;
	parentId?: CategoryInterface;
	image?: ImageInterface;
	createdAt: Date;
	updatedAt: Date;
}

export interface UserInterface extends Omit<DbUser, '_id' | 'passwordHash' | 'passwordResetToken' | 'passwordResetExpires' | 'createdAt' | 'updatedAt'> {
	id: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface CartItemInterface extends Omit<DbCartItem, 'productId'> {
	productId: ProductInterface;
	customization?: {
		colors: { [key: string]: string };
	};
}

export interface CartInterface extends Omit<DbCart, '_id' | 'userId' | 'items' | 'createdAt' | 'updatedAt'> {
	id: string;
	userId: string;
	items: CartItemInterface[];
	createdAt: Date;
	updatedAt: Date;
}

export interface OrderItemInterface extends Omit<DbOrderItem, 'productId'> {
	productId: ProductInterface;
}

export interface OrderInterface extends Omit<DbOrder, '_id' | 'userId' | 'items' | 'createdAt' | 'updatedAt'> {
	id: string;
	userId: UserInterface;
	items: OrderItemInterface[];
	createdAt: Date;
	updatedAt: Date;
}

// ---------- Serializers ----------
export function serializeCategory(category: DbCategory): CategoryInterface {
	return {
		id: convertId(category._id),
		name: category.name,
		slug: category.slug,
		parentId: category.parentId ? serializeCategory(category.parentId) : undefined,
		image: category.image,
		createdAt: new Date(category.createdAt),
		updatedAt: new Date(category.updatedAt),
	};
}

export function serializeCategories(categories: DbCategory[]): CategoryInterface[] {
	return categories.map((c) => serializeCategory(c));
}
export function serializeProducts(products: DbProduct[]): ProductInterface[] {
	return products.map((p) => serializeProduct(p));
}
export function serializeProduct(product: DbProduct): ProductInterface {
	return {
		id: convertId(product._id),
		title: product.title,
		slug: product.slug,
		description: product.description,
		price: product.price,
		categoryIds: product.categoryIds.map(serializeCategory),
		images: product.images,
		variants: product.variants,
		stock: product.stock,
		rating: product.rating,
		aboutItem: product.aboutItem,
		createdAt: new Date(product.createdAt),
		updatedAt: new Date(product.updatedAt),
	};
}

export function serializeUser(user: DbUser): UserInterface {
	return {
		id: convertId(user._id),
		name: user.name,
		email: user.email,
		role: user.role,
		addresses: user.addresses,
		createdAt: new Date(user.createdAt),
		updatedAt: new Date(user.updatedAt),
	};
}

export function serializeCart(cart: DbCart): CartInterface {
	return {
		id: convertId(cart._id),
		userId: convertId(cart.userId),
		items: cart.items.map((item) => ({
			productId: item.productId,
			variantId: item.variantId,
			qty: item.qty,
			name: item.name,
			price: item.price,
			image: item.image,
		})),
		createdAt: new Date(cart.createdAt),
		updatedAt: new Date(cart.updatedAt),
	};
}
export function serializeOrders(order: DbOrder[]): OrderInterface[] {
	return order.map((p) => serializeOrder(p));
}

export function serializeOrder(order: DbOrder): OrderInterface {
	return {
		id: convertId(order._id),
		userId: serializeUser(order.userId), // full user object
		status: order.status,
		total: order.total,
		shippingAddress: order.shippingAddress,
		items: order.items.map((item) => ({
			productId: item.productId,
			variantId: item.variantId,
			qty: item.qty,
			name: item.name,
			price: item.price,
			image: item.image,
		})),
		createdAt: new Date(order.createdAt),
		updatedAt: new Date(order.updatedAt),
	};
}

export const customProductId: ProductInterface = {
	id: '68c99c72fbf6a5383f061826',
	title: 'Customized Hoodie',
	slug: 'customize',
	description: 'Customized Hoodie',
	price: 50,
	images: [],
	variants: [],
	stock: 10,
	rating: 5,
	aboutItem: [],
	createdAt: new Date(),
	updatedAt: new Date(),
	categoryIds: [],
};
