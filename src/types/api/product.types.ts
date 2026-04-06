export interface ProductImage {
  id: number
  src: string
}

export interface ProductCategory {
  id: number
  name: string
}

export type ProductStatus = "publish" | "draft"

export interface Product {
  id: number
  name: string

  price: string
  regular_price: string
  sale_price?: string

  status: ProductStatus
  stock_status: string

  menu_order?: number
  description?: string

  images: ProductImage[]
  categories: ProductCategory[]
}

/* ADMIN RESPONSE */

export interface ProductsResponse {
  data: Product[]
  total: number
  totalPages: number
}