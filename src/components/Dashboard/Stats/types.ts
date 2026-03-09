import type { IconType } from "react-icons"
export interface CategoryStat {
  name: string
  items_sold: number
  revenue: number
  orders: number
    [key: string]: string | number

}

export interface ProductStat {
  name: string
  items_sold: number
  revenue: number
  avg_price: number
}

export interface DailyStat {
  date: string
  revenue: number
  orders: number
  items_sold: number
}

export interface DeletedProductStat {
  name: string
  total_sales: number
  price: string
  last_modified: string
}

export interface AnalyticsData {
  revenue: number
  orders: number
  items_sold: number
  average_order_value: number

  cancelled_orders: number
  pending_orders: number
  processing_orders: number
  completed_orders: number

  categories: CategoryStat[]
  products: ProductStat[]
  daily_stats: DailyStat[]

  deleted_products?: DeletedProductStat[]
}
export interface TabConfig {
  id: string
  label: string
  icon: IconType
  color: string
  borderColor: string
}