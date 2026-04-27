import { useMemo } from "react"
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
} from "@/app/slices/cartSlice"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import type { Product } from "@/types"

export const useHomeCartMetrics = () => {
  const dispatch = useAppDispatch()
  const cart = useAppSelector((state) => state.cart.items)

  const addToCart = (product: Product) => {
    dispatch(addToCartAction(product))
  }

  const removeFromCart = (productId: number) => {
    dispatch(removeFromCartAction(productId))
  }

  const cartCount = useMemo(() => {
    return Object.values(cart).reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    )
  }, [cart])

  const cartTotalAmount = useMemo(() => {
    return Object.values(cart).reduce((sum: number, item: any) => {
      const price = parseFloat(item.sale_price || item.price || "0")
      return sum + price * item.quantity
    }, 0)
  }, [cart])

  return {
    addToCart,
    removeFromCart,
    cartCount,
    cartTotalAmount,
  }
}
