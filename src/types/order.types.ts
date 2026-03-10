/* =========================
   ORDER META DATA
========================= */

export type OrderMetaData = {
  id?: number;
  key: string;
  value: string;
};

/* =========================
   ORDER ITEMS
========================= */

export type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  price: string;
  total: string;
  product_id: number;
};

export type EnhancedOrderItem = OrderItem & {
  image: string;
  totalNumber: number;
};

/* =========================
   SHIPPING
========================= */

export type OrderShippingLine = {
  method_id?: string;
  method_title?: string;
  total?: string;
};

/* =========================
   PERSON INFO
========================= */

export type OrderPersonInfo = {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  postcode?: string;
  country?: string;
  company?: string;
};

/* =========================
   PUBLIC ORDER (Frontend)
========================= */

export type PublicOrder = {
  id: number;
  status: string;
  total: string;
  date_created: string;

  billing: OrderPersonInfo;
  shipping?: OrderPersonInfo;

  line_items: Array<
    Pick<OrderItem, "product_id" | "name" | "quantity" | "total"> &
    Partial<Pick<OrderItem, "id" | "price">>
  >;

  customer_note?: string;
  payment_method_title?: string;

  shipping_total?: string;
  shipping_lines?: OrderShippingLine[];
  shipping_status?: string;

  meta_data?: OrderMetaData[];

  number?: string;
  currency?: string;
  date_modified?: string;
};

/* =========================
   FULL ORDER (ADMIN / API)
========================= */

export type Order = {
  id: number;
  number: string;
  status: string;

  total: string;
  currency: string;

  date_created: string;
  date_modified: string;

 billing: {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address_1: string;
  address_2: string;
  city: string;
  postcode: string;
  country?: string;
  company?: string;
};

  shipping: {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  postcode: string;
  country?: string;
  company?: string;
};

  line_items: OrderItem[];

  customer_note?: string;
  payment_method_title?: string;

  shipping_total?: string;
  shipping_lines?: OrderShippingLine[];
  shipping_status?: string;

  meta_data?: OrderMetaData[];
};

/* =========================
   RECEIPT
========================= */

export type ReceiptData = PublicOrder;