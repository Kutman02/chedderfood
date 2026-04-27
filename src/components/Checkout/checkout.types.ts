import type { CartItem } from "@/types/ui/cart.types"

export interface CartData {
  items: CartItem[]
  totalAmount: number
  totalItems: number

  onAdd: (product: any) => void
  onRemove: (id: number) => void
  onClear: () => void

  siteUrl: string
}

export interface CheckoutProps {
  onClose: () => void
  cartData: CartData
}
