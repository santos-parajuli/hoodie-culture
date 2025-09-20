import { createJSONStorage, persist } from 'zustand/middleware';

import { CartItemInterface } from '@/utils/types/types';
// stores/appStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface CartState {
	cartItems: CartItemInterface[];
}

interface CartActions {
	addItem: (item: CartItemInterface) => void;
	removeItem: (productId: string, variantId?: string) => void;
	updateItemQuantity: (productId: string, qty: number, variantId?: string) => void;
	clearCart: () => void;
	getCartTotal: () => number;
	getCartItemCount: () => number;
}

type AppState = CartState & CartActions;

export const useAppStore = create<AppState>()(
	persist(
		immer((set, get) => ({
			cartItems: [],
			addItem: (item) => {
				set((state) => {
					const existingItem = state.cartItems.find((i) => i.productId === item.productId && i.variantId === item.variantId);
					if (existingItem) {
						existingItem.qty += item.qty;
					} else {
						state.cartItems.push(item);
					}
				});
			},
			removeItem: (productId, variantId) => {
				set((state) => {
					state.cartItems = state.cartItems.filter((i) => !(i.productId.id === productId && i.variantId === variantId));
				});
			},
			updateItemQuantity: (productId, qty, variantId) => {
				set((state) => {
					const item = state.cartItems.find((i) => i.productId.id === productId && i.variantId === variantId);
					if (item) {
						item.qty = qty;
						if (item.qty <= 0) {
							state.cartItems = state.cartItems.filter((i) => !(i.productId.id === productId && i.variantId === variantId));
						}
					}
				});
			},
			clearCart: () => {
				set((state) => {
					state.cartItems = [];
				});
			},
			getCartTotal: () => {
				return get().cartItems.reduce((total, item) => total + item.price * item.qty, 0);
			},
			getCartItemCount: () => {
				return get().cartItems.reduce((count, item) => count + item.qty, 0);
			},
		})),
		{
			name: 'cart-storage',
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				cartItems: state.cartItems, // ✅ persist only raw items
			}),
		}
	)
);
