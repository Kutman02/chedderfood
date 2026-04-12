export interface CartItem {
  id: number
  product_id: number
  name: string
  price: string
  regular_price?: string
  sale_price?: string
  quantity: number
  image?: string
  images?: Array<{ id: number; src: string }>
  categories?: Array<{ id: number; name: string }>
  stock_status?: string
  status?: string
  menu_order?: number
  description?: string
}

export type CartMap = Record<number, CartItem>
