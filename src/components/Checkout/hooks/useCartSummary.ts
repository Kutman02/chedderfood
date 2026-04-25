import { useMemo } from "react"
import { useAppSelector } from "@/app/hooks"
import type { CartMap } from "@/types"

export const useCartSummary = () => {
  const cart = useAppSelector((s) => s.cart.items)

  const cartValues = useMemo(
    () => Object.values(cart as CartMap),
    [cart]
  )

  const cartItems = useMemo(
    () =>
      cartValues.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    [cartValues]
  )

  const totalAmount = useMemo(
    () =>
      cartValues.reduce((sum, item) => {
        const price = parseFloat(item.sale_price || item.price || "0") || 0
        return sum + price * item.quantity
      }, 0),
    [cartValues]
  )

  return {
    cartItems,
    totalAmount,
    cartValues,
  }
}