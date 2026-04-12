export interface CreateOrderInput {
  formData: {
    first_name: string
    address: string
    phone: string
    customer_note?: string
  }

  cartItems: {
    product_id: number
    quantity: number
  }[]

  orderType: "pickup" | "delivery"
  onClose: () => void
}

export interface CustomerData {
  first_name: string
  address: string
  phone: string
}

export type ReceiptData = import("../api/order.types").Order

export interface TabConfig {
  id: string
  label: string
  color: string
  borderColor: string
  icon?: unknown
  bgColor?: string
  textColor?: string
}
