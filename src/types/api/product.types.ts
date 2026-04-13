import type { Tag } from "./tag.types"

export interface ProductImage {
  id: number
  src: string
}

export interface ProductCategory {
  id: number
  name: string
  slug?: string
  description?: string
}

export type ProductStatus = "publish" | "draft" | "pending"
export type StockStatus = "instock" | "outofstock"

export interface Product {
  id: number
  name: string

  price: string
  regular_price?: string
  sale_price?: string | null

  status: ProductStatus
  stock_status: StockStatus

  menu_order?: number
  description?: string
  visible?: boolean

  images: ProductImage[]
  categories: ProductCategory[]
  tags?: Tag[]
  weight?: string | number
}

export interface ProductsResponse {
  success: boolean
  data: Product[]
  total: number
  totalPages?: number
  page?: number
  per_page?: number
}
