import type { CheckoutFormData, ShippingRate } from "@/types"

type CheckoutModalSource = {
  showConfirmModal: boolean
  formData: CheckoutFormData
  fullPhone: string
  orderType: "delivery" | "pickup"
  pickupAddress: string
  selectedShippingRate: ShippingRate | null
  totalAmount: number
  shippingCost: number
  totalWithShipping: number
  errorMessage: string
  isSubmitting: boolean
  handleConfirmOrder: () => void
  handleCancelConfirm: () => void
}

export const useCheckoutModalProps = (checkout: CheckoutModalSource) => {
  return {
    open: checkout.showConfirmModal,
    formData: checkout.formData,
    phone: checkout.fullPhone,
    orderType: checkout.orderType,
    pickupAddress: checkout.pickupAddress,
    shippingLabel:
      checkout.orderType === "pickup"
        ? "Самовывоз"
        : checkout.selectedShippingRate?.label || "Способ доставки не выбран",
    subtotal: checkout.totalAmount,
    shippingCost: checkout.shippingCost,
    totalAmount: checkout.totalWithShipping,
    errorMessage: checkout.errorMessage,
    isSubmitting: checkout.isSubmitting,
    onConfirm: checkout.handleConfirmOrder,
    onCancel: checkout.handleCancelConfirm,
  }
}
