import { FaMapMarkerAlt } from "react-icons/fa"
import type { OrderAddressProps } from "../types/orderCard.types"
import { useGetRestaurantHoursStatusQuery } from "@/api"

export const OrderAddress = ({
  order,
  activeTabData
}: OrderAddressProps) => {

  const { data: restaurantHoursResponse } = useGetRestaurantHoursStatusQuery()
  const restaurantPickupAddress =
    restaurantHoursResponse?.data?.pickup?.address?.trim() || ""

  const o = order as any // 🔥 временный фикс

  const normalizedType = (o?.order_type || "").toString().trim().toLowerCase()
  const isPickup =
    normalizedType === "pickup" ||
    normalizedType === "local_pickup" ||
    normalizedType.includes("самовывоз") ||
    Boolean(o?.pickup_address)

  const normalizeAddress = (value: string | undefined) => {
    if (!value) return undefined
    const trimmed = value.trim()
    if (!trimmed) return undefined
    const lowered = trimmed.toLowerCase()
    if (lowered === "pickup" || lowered === "local_pickup" || lowered === "самовывоз") {
      return undefined
    }
    return trimmed
  }

  const address =
    (isPickup
      ? normalizeAddress(o?.pickup_address) || normalizeAddress(o?.address) || restaurantPickupAddress
      : normalizeAddress(o?.address)) ||
    o?.shipping_address ||
    o?.billing?.address_1 ||
    "Адрес не указан"

  return (

    <div className={`${activeTabData?.bgColor} p-3 rounded-xl border`}>

      <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
        <FaMapMarkerAlt />
        {isPickup ? "Адрес ресторана (самовывоз):" : "Адрес:"}
      </p>

      <p className="text-sm font-semibold">
        {address}
      </p>

    </div>

  )
}