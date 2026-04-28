import { FaMapMarkerAlt, FaStore, FaTruck } from "react-icons/fa"
import type { OrderAddressProps } from "../types/orderCard.types"
import { useGetRestaurantHoursStatusQuery } from "@/api"

export const OrderAddress = ({
  order
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

  const statusLabel = isPickup ? "Самовывоз" : "Доставка"
  const addressTitle = isPickup ? "Адрес самовывоза" : "Адрес доставки"

  const containerClasses = isPickup
    ? "border-emerald-200 bg-emerald-50/85"
    : "border-sky-200 bg-sky-50/85"

  const badgeClasses = isPickup
    ? "bg-emerald-600 text-emerald-50"
    : "bg-sky-600 text-sky-50"

  return (

    <div className={`rounded-xl border px-3 py-3 sm:px-3 sm:py-2.5 ${containerClasses}`}>

      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-700">
          {isPickup ? <FaStore size={12} /> : <FaTruck size={12} />}
          {addressTitle}
        </p>

        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${badgeClasses}`}>
          {statusLabel}
        </span>
      </div>

      <p className="mt-2 flex items-start gap-2 text-base font-semibold leading-snug text-slate-900 wrap-break-word sm:text-sm">
        <FaMapMarkerAlt className="mt-0.5 shrink-0 text-slate-500" />
        <span className="wrap-break-word">{address}</span>
      </p>

    </div>

  )
}