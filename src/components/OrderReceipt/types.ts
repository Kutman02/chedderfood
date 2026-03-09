import type { Product, PublicOrder, OrderItem } from "../../types"

export interface OrderReceiptProps {
  orderData: PublicOrder
  products: Product[]
  onClose: () => void
  onNewOrder: () => void
}

export type OrderItemWithImage = Omit<OrderItem, "total"> & {
  image: string
  total: number
  fallback?: string
}

export interface ShippingInfo {
  method: string
  address: string
  cost: number
  status: string
}