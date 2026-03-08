/* =========================
   ANALYTICS TOTALS
========================= */

export type AnalyticsTotals = {
  sales: string;
  orders: number;
  items: number;
  customers: number;
  coupons: number;
};


/* =========================
   ANALYTICS SUBTOTALS
========================= */

export type AnalyticsSubtotals = {
  sales: string;
  orders: number;
  items: number;
  customers: number;
  coupons: number;
};


/* =========================
   ANALYTICS INTERVAL
========================= */

export type AnalyticsInterval = {
  interval: string;

  date_start: string;
  date_end: string;

  subtotals: AnalyticsSubtotals;
};


/* =========================
   ANALYTICS RESPONSE
========================= */

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

  totals: AnalyticsTotals;

  intervals?: AnalyticsInterval[];
};