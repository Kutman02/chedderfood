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

export interface StatusChange {
  status: OrderStatus
  reason?: string | null
  changed_by_user_id?: number
  changed_by_user_name?: string
  changed_at?: string
}

export type OrderType = "delivery" | "pickup"

export interface ShippingRate {
  rate_id: string
  method_id: string
  instance_id: number
  label: string
  cost: number
  tax_total?: number
  total: number
  currency: string
  is_free: boolean
}

export interface ShippingMethodSelection {
  rate_id: string
  method_id?: string
  instance_id?: number
}

export interface ShippingMethodsRequest {
  order_type?: OrderType
  billing?: {
    address_1?: string
    address_2?: string
    apartment_office?: string
    city?: string
    postcode?: string
    country?: string
    state?: string
  }
  line_items: {
    product_id: number
    quantity: number
  }[]
}

export interface ShippingMethodsPayload {
  order_type: OrderType
  requires_shipping: boolean
  default_rate_id?: string | null
  methods: ShippingRate[]
}

export interface ShippingMethodsResponse {
  success: boolean
  data: ShippingMethodsPayload
}

export interface Order {
  id: number
  status: OrderStatus
  reason?: string | null
  status_history?: StatusChange[]
  public_key?: string | null
  total: string
  shipping_total?: string
  shipping_lines?: ShippingRate[]
  currency?: string
  date_created: string
  date_created_gmt?: string
  created_at?: string
  date_created_unix?: number
  date_created_human?: string
  changed_at?: string | null
  changed_by_user_id?: number | null

  customer_name: string
  phone: string
  address?: string
  address_2?: string
  apartment_office?: string
  apartment?: string
  floor?: string
  city?: string
  postcode?: string
  email?: string
  first_name?: string
  last_name?: string
  customer_note?: string
  order_type?: OrderType
  pickup_address?: string
  pickup_map_url?: string
  pickup_2gis_url?: string
  needs_cutlery_and_napkins?: boolean
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
  status_counts_today?: OrderStatusCounts
  status_counts_range?: OrderStatusCounts
  date_filters?: {
    scope?: "today" | "all" | null
    applied_scope?: "today" | "all" | "date" | "range" | null
    date?: string | null
    date_from?: string | null
    date_to?: string | null
  }
}

export interface OrderStatusCounts {
  "on-hold": number
  processing: number
  ready: number
  completed: number
  cancelled: number
}

export interface CreateOrderRequest {
  status?: OrderStatus
  order_type?: OrderType
  shipping_method?: ShippingMethodSelection

  billing: {
    first_name: string
    last_name?: string
    phone: string
    email?: string
    address_1?: string
    address_2?: string
    apartment_office?: string
    apartment?: string
    floor?: string
    city?: string
    postcode?: string
    country?: string
    state?: string
  }

  customer_note?: string
  needs_cutlery_and_napkins?: boolean
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
  public_key?: string
  order?: Order
  message?: string
}

export type PublicOrder = Order

export interface UpdateOrderStatusResponse {
  success: boolean
  id: number
  status: OrderStatus
  reason?: string | null
  changed_by_user_id?: number
  changed_at?: string
  message?: string
}

export interface DashboardAnalyticsSummary {
  period: string
  start_date: string
  end_date: string
  total_orders: number
  total_revenue: number
  average_order_value: number
  total_items_sold: number
}

export interface DashboardRangeInfo {
  date_from: string
  date_to: string
  date_from_display?: string
  date_to_display?: string
  label?: string
  timezone?: string
}

export interface DashboardAvailablePeriod {
  key: string
  label: string
  days: number
}

export interface DashboardSalesChartPoint {
  date: string
  orders: number
  revenue: number
}

export interface DashboardOrderStatusUi {
  waiting?: number
  preparing?: number
  cancelled?: number
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
  range?: DashboardRangeInfo
  available_periods?: DashboardAvailablePeriod[]
  selected_period?: string
  top_products: DashboardTopProduct[]
  order_status_breakdown: {
    "on-hold"?: number
    pending?: number
    processing?: number
    ready?: number
    completed?: number
    cancelled?: number
    failed?: number
    refunded?: number
  }
  order_status_ui?: DashboardOrderStatusUi
  sales_chart?: DashboardSalesChartPoint[]
}

export interface DashboardAnalyticsResponse {
  success: boolean
  data: DashboardAnalyticsData
}
