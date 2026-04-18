import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartMap, Product } from "@/types";
import { STORAGE_KEYS } from "@/shared/constants/storage" 
import { storage } from "@/shared/lib/storage"

type CartState = {
  items: CartMap;
};

const CART_KEY = STORAGE_KEYS.CART;

const loadCart = (): CartMap => {
  return storage.getJSON<CartMap>(CART_KEY, {})
};

const initialState: CartState = {
  items: loadCart(),
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;

      if (state.items[product.id]) {
        state.items[product.id].quantity += 1;
      } else {
        state.items[product.id] = {
          ...product,
          sale_price: product.sale_price ?? undefined,
          product_id: product.id,
          quantity: 1,
        };
      }
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      const item = state.items[productId];

      if (!item) return;

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        delete state.items[productId];
      }
    },

    clearCart: (state) => {
      state.items = {};
    },

    setQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;

      const item = state.items[productId];
      if (!item) return;

      if (quantity <= 0) {
        delete state.items[productId];
      } else {
        item.quantity = quantity;
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, setQuantity } =
  cartSlice.actions;

export const cartReducer = cartSlice.reducer;
export const cartStorageKey = CART_KEY;
