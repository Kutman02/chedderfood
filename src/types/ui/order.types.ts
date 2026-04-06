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