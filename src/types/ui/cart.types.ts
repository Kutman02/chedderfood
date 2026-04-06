export interface CartItem {
  id: number
  product_id: number
  name: string
  price: string
  sale_price?: string
  quantity: number
  image?: string
}

export type CartMap = Record<number, CartItem>