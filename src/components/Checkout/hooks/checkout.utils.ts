import type { RestaurantHoursStatus, ShippingRate } from "@/types"

export const toLocalPhoneNumber = (
  rawPhone: string,
  dialCode: string,
  maxDigits: number
) => {
  const phoneDigits = rawPhone.replace(/\D/g, "")
  if (!phoneDigits) return ""

  const dialDigits = dialCode.replace(/\D/g, "")

  const localPart =
    dialDigits && phoneDigits.startsWith(dialDigits)
      ? phoneDigits.slice(dialDigits.length)
      : phoneDigits

  return localPart.slice(0, maxDigits)
}

export const resolvePickupAddress = (
  restaurantHours?: RestaurantHoursStatus | null
) => {
  if (!restaurantHours) return ""

  const candidates = [
    restaurantHours.pickup?.address,
    restaurantHours.pickup_address,
    restaurantHours.restaurant_address,
    restaurantHours.address,
  ]

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim()
    }
  }

  return ""
}

export const resolvePickupMapUrl = (
  restaurantHours?: RestaurantHoursStatus | null
) => {
  if (!restaurantHours) return ""

  const candidates = [
    restaurantHours.pickup?.map_url,
    restaurantHours.pickup_map_url,
    restaurantHours.pickup_2gis_url,
    restaurantHours.map_2gis,
    restaurantHours.map2gis,
  ]

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim()
    }
  }

  return ""
}

export const extractApiErrorMessage = (
  error: unknown,
  fallbackMessage: string
): string => {
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data?: unknown }).data

    if (typeof data === "string" && data.trim()) {
      return data
    }

    if (data && typeof data === "object" && "message" in data) {
      const message = (data as { message?: unknown }).message
      if (typeof message === "string" && message.trim()) {
        return message
      }
    }
  }

  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message
    if (typeof message === "string" && message.trim()) {
      return message
    }
  }

  return fallbackMessage
}

export const getShippingCost = (
  orderType: "delivery" | "pickup",
  selectedShippingRate: ShippingRate | null
) => {
  if (orderType !== "delivery") {
    return 0
  }

  return Math.max(
    Number(
      selectedShippingRate?.total ??
        selectedShippingRate?.cost ??
        0
    ) || 0,
    0
  )
}

export const formatShippingPrice = (method: ShippingRate) => {
  const amount = Number(method.total ?? method.cost ?? 0)

  if (!Number.isFinite(amount) || amount <= 0 || method.is_free) {
    return "Бесплатно"
  }

  return `${amount.toFixed(0)} сом`
}
