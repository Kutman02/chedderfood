import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../../types/types';

type CartState = {
  items: CartItem;
};

const CART_KEY = 'chedderfood_cart';

const loadCart = (): CartItem => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem) : {};
  } catch {
    return {};
  }
};

const initialState: CartState = {
  items: loadCart(),
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.items[productId] = (state.items[productId] || 0) + 1;
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      const current = state.items[productId] || 0;
      if (current > 1) {
        state.items[productId] = current - 1;
      } else {
        delete state.items[productId];
      }
    },
    clearCart: (state) => {
      state.items = {};
    },
    setQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        delete state.items[productId];
      } else {
        state.items[productId] = quantity;
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, setQuantity } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
export const cartStorageKey = CART_KEY;
