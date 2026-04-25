import type { ShippingRate, ShippingMethodSelection } from "../api/order.types"

export interface CreateOrderInput {
  formData: {
    first_name: string
    address: string
    phone: string
    customer_note?: string
    apartment_office?: string
    floor?: string
    needs_cutlery_and_napkins?: boolean
  }

  cartItems: {
    product_id: number
    quantity: number
  }[]

  orderType: "pickup" | "delivery"
  shippingMethod?: ShippingMethodSelection
  selectedShippingRate?: ShippingRate
  pickupAddress?: string
  pickupMapUrl?: string
  onClose: () => void
}

export interface CustomerData {
  first_name: string
  address: string
  phone: string
  apartment_office?: string
  floor?: string
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
