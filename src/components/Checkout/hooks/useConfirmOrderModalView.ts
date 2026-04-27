import type { CheckoutFormData } from "@/types"

type UseConfirmOrderModalViewArgs = {
  formData: CheckoutFormData
  phone: string
  orderType: "delivery" | "pickup"
  pickupAddress: string
  shippingLabel: string
  subtotal: number
  shippingCost: number
  totalAmount: number
}

export const useConfirmOrderModalView = ({
  formData,
  phone,
  orderType,
  pickupAddress,
  shippingLabel,
  subtotal,
  shippingCost,
  totalAmount,
}: UseConfirmOrderModalViewArgs) => {
  const addressLabel = `Адрес (${orderType === "pickup" ? "Самовывоз" : "Доставка"})`

  const addressValue =
    orderType === "pickup"
      ? (pickupAddress || "Адрес ресторана не указан")
      : (formData.address || "Не указан")

  const phoneValue = phone || formData.phone || "Не указан"

  const shippingRowLabel =
    orderType === "pickup"
      ? "Самовывоз"
      : `Доставка (${shippingLabel})`

  return {
    addressLabel,
    addressValue,
    phoneValue,
    shippingRowLabel,
    subtotalLabel: `${subtotal.toFixed(0)} сом`,
    shippingLabelValue: shippingCost > 0 ? `${shippingCost.toFixed(0)} сом` : "Бесплатно",
    shippingIsFree: shippingCost <= 0,
    totalLabel: `${totalAmount.toFixed(0)} сом`,
  }
}
