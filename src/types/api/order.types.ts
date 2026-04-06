export interface OrderItem {
  id: number
  product_id: number
  name: string
  quantity: number
  total: string
  price: number
  image?: string | null
}

export type OrderStatus =
  | "on-hold"
  | "processing"
  | "ready"
  | "completed"
  | "cancelled"

export interface Order {
  id: number
  status: OrderStatus
  total: string
  currency: string
  date_created: string

  customer_name: string
  phone: string
  address: string

  line_items: OrderItem[]
}

export interface OrdersResponse {
  data: Order[]
  total: number
  totalPages: number
}
export interface CreateOrderRequest {
  status?: OrderStatus

  billing: {
    first_name: string
    phone: string
    address_1: string
  }

  customer_note?: string

  line_items: {
    product_id: number
    quantity: number
  }[]

  meta_data?: {
    key: string
    value: string
  }[]
}

export interface CreateOrderResponse {
  id: number
  status: OrderStatus
  total: string
}