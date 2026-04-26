import { useEffect, useMemo, useState } from "react"
import { useGetShippingMethodsMutation } from "@/api"
import type { CreateOrderInput, ShippingRate } from "@/types"
import { extractApiErrorMessage } from "./checkout.utils"

type UseCheckoutShippingParams = {
  orderType: "delivery" | "pickup"
  cartItems: CreateOrderInput["cartItems"]
}

export const useCheckoutShipping = ({
  orderType,
  cartItems,
}: UseCheckoutShippingParams) => {
  const [getShippingMethods, { isLoading: isShippingMethodsLoading }] =
    useGetShippingMethodsMutation()

  const [shippingMethods, setShippingMethods] = useState<ShippingRate[]>([])
  const [selectedShippingRateId, setSelectedShippingRateId] = useState("")
  const [shippingError, setShippingError] = useState("")

  const selectedShippingRate = useMemo(
    () =>
      shippingMethods.find((method) => method.rate_id === selectedShippingRateId) || null,
    [shippingMethods, selectedShippingRateId]
  )

  useEffect(() => {
    let isCancelled = false

    const loadShippingMethods = async () => {
      if (orderType === "pickup") {
        setShippingMethods([])
        setSelectedShippingRateId("")
        setShippingError("")
        return
      }

      if (!cartItems.length) {
        setShippingMethods([])
        setSelectedShippingRateId("")
        setShippingError("")
        return
      }

      setShippingError("")

      try {
        const response = await getShippingMethods({
          order_type: "delivery",
          line_items: cartItems,
        }).unwrap()

        if (isCancelled) return

        const requiresShipping = response.data?.requires_shipping !== false
        const methods = Array.isArray(response.data?.methods)
          ? response.data.methods
          : []

        const availableMethods = requiresShipping ? methods : []
        setShippingMethods(availableMethods)

        if (!requiresShipping) {
          setSelectedShippingRateId("")
          return
        }

        const ids = new Set(availableMethods.map((method) => method.rate_id))
        const defaultRateId =
          (response.data.default_rate_id && ids.has(response.data.default_rate_id)
            ? response.data.default_rate_id
            : availableMethods[0]?.rate_id) || ""

        setSelectedShippingRateId((prev) =>
          ids.has(prev) ? prev : defaultRateId
        )

        if (!availableMethods.length) {
          setShippingError(
            "Для текущей корзины нет доступных способов доставки."
          )
        }
      } catch (error) {
        if (isCancelled) return

        setShippingMethods([])
        setSelectedShippingRateId("")
        setShippingError(
          extractApiErrorMessage(
            error,
            "Не удалось получить способы доставки. Попробуйте снова."
          )
        )
      }
    }

    loadShippingMethods()

    return () => {
      isCancelled = true
    }
  }, [
    orderType,
    cartItems,
    getShippingMethods,
  ])

  const handleShippingMethodSelect = (rateId: string) => {
    setSelectedShippingRateId(rateId)
    setShippingError("")
  }

  return {
    shippingMethods,
    selectedShippingRate,
    selectedShippingRateId,
    shippingError,
    isShippingMethodsLoading,
    handleShippingMethodSelect,
  }
}
