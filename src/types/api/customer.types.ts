export interface Customer {
  id: string
  first_name: string
  phone: string
  address?: string
  orders_count: number
  total_spent: number
}

export interface CustomerDetails {
  success: boolean
  customer: Customer
  orders: import("./order.types").Order[]
  orders_count: number
  analytics?: {
    total_spent: number
    first_order_date: string
    last_order_date: string
  }
}

export interface CustomersResponse {
  success: boolean
  data: Customer[]
  total?: number
}
