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
  | "pending"
  | "on-hold"
  | "processing"
  | "ready"
  | "completed"
  | "cancelled"
  | "failed"
  | "refunded"

export type OrderType = "delivery" | "pickup"

export interface Order {
  id: number
  status: OrderStatus
  total: string
  currency?: string
  date_created: string

  customer_name: string
  phone: string
  address?: string
  apartment?: string
  floor?: string
  customer_note?: string
  order_type?: OrderType
  needs_cutlery?: boolean
  needs_napkins?: boolean
  line_items?: OrderItem[]
  items?: OrderItem[]
  number?: string | number
}

export interface OrdersResponse {
  success: boolean
  data: Order[]
  total: number
  totalPages?: number
  page?: number
  per_page?: number
}

export interface CreateOrderRequest {
  status?: OrderStatus

  billing: {
    first_name: string
    last_name?: string
    phone: string
    email?: string
    address_1?: string
    address_2?: string
    apartment?: string
    floor?: string
    city?: string
    postcode?: string
  }

  customer_note?: string
  needs_cutlery?: boolean
  needs_napkins?: boolean

  line_items: {
    product_id: number
    quantity: number
  }[]

  meta_data?: Array<{
    key: string
    value: string
  }>
}

export interface CreateOrderResponse {
  success: boolean
  id: number
  status: OrderStatus
  total: number
  items_count?: number
  order?: Order
  message?: string
}

export type PublicOrder = Order

export interface UpdateOrderStatusResponse {
  success: boolean
  id: number
  status: OrderStatus
  message?: string
}

export interface DashboardAnalyticsSummary {
  period: "day" | "week" | "month"
  start_date: string
  end_date: string
  total_orders: number
  total_revenue: number
  average_order_value: number
  total_items_sold: number
}

export interface DashboardTopProduct {
  id: number
  name: string
  quantity_sold: number
  price: number
  total_revenue: number
}

export interface DashboardAnalyticsData {
  summary: DashboardAnalyticsSummary
  top_products: DashboardTopProduct[]
  order_status_breakdown: Partial<Record<OrderStatus, number>>
}

export interface DashboardAnalyticsResponse {
  success: boolean
  data: DashboardAnalyticsData
}
