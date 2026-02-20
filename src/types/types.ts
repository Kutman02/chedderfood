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

export type OrderShippingLine = {
  method_id?: string;
  method_title?: string;
  total?: string;
};

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

export type PublicOrder = {
  id: number;
  status: string;
  total: string;
  date_created: string;
  billing: OrderPersonInfo;
  shipping?: OrderPersonInfo;
  line_items: Array<Pick<OrderItem, 'product_id' | 'name' | 'quantity' | 'total'> & Partial<Pick<OrderItem, 'id' | 'price'>>>;
  customer_note?: string;
  payment_method_title?: string;
  shipping_total?: string;
  shipping_lines?: OrderShippingLine[];
  shipping_status?: string;

  number?: string;
  currency?: string;
  date_modified?: string;
};

export type ReceiptData = PublicOrder;

export type CustomerData = {
  first_name: string;
  phone: string;
  address: string;
};

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
    };
    shipping: {
      first_name: string;
      last_name: string;
      address_1: string;
      address_2: string;
      city: string;
      postcode: string;
    };
    line_items: OrderItem[];
    customer_note?: string;
    payment_method_title?: string;
    shipping_total?: string;
    shipping_lines?: Array<{
      method_id: string;
      method_title: string;
      total: string;
    }>;
    shipping_status?: string;
    meta_data?: Array<{
      id: number;
      key: string;
      value: string;
    }>;
  };

  // Типы для корзины
  export type CartItem = {
    [productId: number]: number;
  };

  // Типы для формы оформления заказа
  export interface CheckoutFormData {
    first_name: string;
    address: string;
    phone: string;
    customer_note: string;
  }

  // Типы для создания заказа (API)
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
    line_items: Array<{
      product_id: number;
      quantity: number;
    }>;
    customer_note?: string;
  }
  
  export type Notification = {
    id: number;
    message: string;
    type: 'success' | 'error';
  };
  
  export interface TabConfig {
    id: string;
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }

  export type Category = {
    id: number;
    name: string;
    slug: string;
    description?: string;
    parent?: number;
    count?: number;
  };

  export type Product = {
    id: number;
    name: string;
    slug: string;
    permalink: string;
    type: string;
    status: string;
    featured: boolean;
    catalog_visibility: string;
    description: string;
    short_description: string;
    sku: string;
    price: string;
    regular_price: string;
    sale_price: string;
    weight?: string | number; // WooCommerce может возвращать вес как строку или число
    date_created: string;
    date_modified: string;
    stock_status: string;
    stock_quantity: number | null;
    menu_order?: number;
    total_sales?: number; // Available from analytics API
    images: Array<{
      id: number;
      src: string;
      name: string;
      alt: string;
    }>;
    categories: Array<{
      id: number;
      name: string;
      slug: string;
    }>;
    tags?: Array<{
      id: number;
      name: string;
      slug: string;
    }>;
  };

  export type ProductStatus = 'hit' | 'new' | 'sale' | 'none';

  export type Customer = {
    id: number;
    date_created: string;
    date_modified: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    username: string;
    billing: {
      first_name: string;
      last_name: string;
      company: string;
      address_1: string;
      address_2: string;
      city: string;
      postcode: string;
      country: string;
      email: string;
      phone: string;
    };
    shipping: {
      first_name: string;
      last_name: string;
      company: string;
      address_1: string;
      address_2: string;
      city: string;
      postcode: string;
      country: string;
    };
    orders_count: number;
    total_spent: string;
  };

  export type AnalyticsResponse = {
    total_sales: string;
    net_sales: string;
    average_order_value: string;
    total_orders: number;
    total_items: number;
    total_customers: number;
    coupons: number;
    coupons_amount: string;
    shipping: string;
    shipping_tax: string;
    tax: string;
    refunds: number;
    discount_amount: string;
    gross_sales: string;
    totals: {
      sales: string;
      orders: number;
      items: number;
      customers: number;
      coupons: number;
    };
    intervals?: Array<{
      interval: string;
      date_start: string;
      date_end: string;
      subtotals: {
        sales: string;
        orders: number;
        items: number;
        customers: number;
        coupons: number;
      };
    }>;
  };

  export type LoginResponse = {
    token: string;
    user_email: string;
    user_nicename: string;
    user_display_name: string;
  };