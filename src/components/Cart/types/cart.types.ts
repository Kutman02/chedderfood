import type { Product, PublicOrder } from "../../../types";

/* =========================
   CART ITEM
========================= */

export type CartItem = Product & {
  quantity: number;
};


/* =========================
   CART STATE
========================= */

export interface CartState {
  items: {
    [productId: number]: CartItem;
  };
}

/* =========================
   CART TOTALS
========================= */

export interface CartTotals {
  totalItems: number;
  totalAmount: number;
}


/* =========================
   CART HOOK RETURN
========================= */

export interface UseCartReturn {
  siteUrl: string;

  products?: Product[];
  productsLoading: boolean;

  cartItems: CartItem[];
  totalAmount: number;
  totalItems: number;

  showCheckoutForm: boolean;
  showReceipt: boolean;
  createdOrderData: PublicOrder | null;

  handleAdd: (productId: number) => void;
  handleRemove: (productId: number) => void;
  handleClearCart: () => void;
  handleCloseCart: () => void;

  handleCheckout: () => void;
  handleCheckoutBack: () => void;
  handleCheckoutSuccess: () => void;
  handleCheckoutShowReceipt: (orderData: PublicOrder) => void;

  handleReceiptClose: () => void;
  handleReceiptNewOrder: () => void;
}