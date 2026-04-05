/* =========================
   ORDER ITEM
========================= */

export type OrderItem = {
  id: number
  product_id: number

  name: string
  quantity: number

  total: string
  price: string

  image: string
}


/* =========================
   ORDER
========================= */

export type Order = {
  id: number
  number: number | string

  status: string
  total: string

  /* =========================
     DATES
  ========================= */
  date_created: string
  date_modified?: string

  /* =========================
     CUSTOMER
  ========================= */
  customer_name: string
  phone: string
  address: string

  customer_note: string

  /* =========================
     ORDER TYPE
  ========================= */
  order_type: "delivery" | "pickup"
  pickup_address?: string

  /* =========================
     PAYMENT
  ========================= */
  payment_method_title?: string

  /* =========================
     SYSTEM (🔥 КЛЮЧЕВОЕ)
  ========================= */
  currency: string
  shipping_total: string

  /* =========================
     ITEMS
  ========================= */
  items: OrderItem[]

  /* =========================
     META
  ========================= */
  meta?: Record<string, any>
}