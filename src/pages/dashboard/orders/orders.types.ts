import type { Product } from "@/types"

export type DashboardSearchSection =
  | "orders"
  | "products"
  | "customers"
  | "categories"
  | "tags"

export type OrdersOutletContext = {
  products: Product[]
  searchQuery: string
  setSearchMeta: (
    section: DashboardSearchSection,
    meta: { found: number; total: number; loading?: boolean }
  ) => void
}

export type OrdersDateMode = "today" | "all" | "day" | "range"

export type OrdersDateFilter = {
  mode: OrdersDateMode
  date?: string
  date_from?: string
  date_to?: string
}
