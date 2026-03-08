/* =========================
   CART
========================= */

/**
 * Cart хранит количество товаров по id продукта
 * пример: { 12: 2, 45: 1 }
 */
export type CartItem = {
  [productId: number]: number;
};


/* =========================
   CHECKOUT FORM
========================= */

export interface CheckoutFormData {
  first_name: string;
  address: string;
  phone: string;
  customer_note: string;
}


/* =========================
   CUSTOMER DATA (для автозаполнения)
========================= */

// export type CustomerData = {
//   first_name: string;
//   phone: string;
//   address: string;
// };


/* =========================
   ORDER LINE ITEM
========================= */

export type CheckoutLineItem = {
  product_id: number;
  quantity: number;
};


/* =========================
   CREATE ORDER REQUEST
========================= */

export interface CreateOrderData {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;

  billing: {
    first_name: string;
    address_1: string;
    phone: string;
  };

  shipping: {
    first_name: string;
    address_1: string;
    phone: string;
  };

  line_items: CheckoutLineItem[];

  customer_note?: string;
}


/* =========================
   CHECKOUT STATE (UI)
========================= */

export type CheckoutState = {
  isSubmitting: boolean;
  showConfirmModal: boolean;
  errorMessage?: string;
};