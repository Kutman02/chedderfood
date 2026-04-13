import { FaCheckCircle, FaCopy } from "react-icons/fa"
import type { Order } from "@/types"
import { useGetRestaurantHoursStatusQuery } from "@/api"

interface Props {
  order: Order
}

export const OrderTypeInfo = ({ order }: Props) => {
  const { data: restaurantHoursResponse } = useGetRestaurantHoursStatusQuery()

  const restaurantPickupAddress =
    restaurantHoursResponse?.data?.pickup?.address?.trim() || ""

  const restaurantPickupMapUrl =
    restaurantHoursResponse?.data?.pickup?.map_url?.trim() || ""


  /* ===============================
     SAFE DATA
  =============================== */

  const orderTypeValue = (order.order_type || "").trim().toLowerCase()

  const orderType =
    orderTypeValue === "pickup" ||
    orderTypeValue === "local_pickup" ||
    orderTypeValue.includes("самовывоз") ||
    Boolean(order.pickup_address)
      ? "pickup"
      : "delivery"

  const isPickup = orderType === "pickup"

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

  const addressRaw = isPickup
    ? (normalizeAddress(order.pickup_address) || normalizeAddress(order.address))
    : normalizeAddress(order.address)

  const pickupMapUrl = (
    order.pickup_map_url ||
    order.pickup_2gis_url ||
    restaurantPickupMapUrl ||
    ""
  ).trim()

  const address = (addressRaw?.trim() || (isPickup ? restaurantPickupAddress : "") || "")

  /* ===============================
     COPY
  =============================== */

  const handleCopy = async () => {
    if (!address) return

    try {
      await navigator.clipboard.writeText(address)
    } catch {
      // fallback
      const textarea = document.createElement("textarea")
      textarea.value = address
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
    }
  }

  /* ===============================
     UI
  =============================== */

  return (
    <div
      className={`rounded-xl p-4 border-2 ${
        isPickup
          ? "bg-green-50 border-green-200"
          : "bg-blue-50 border-blue-200"
      }`}
    >

      <h3 className="flex items-center gap-2 font-black text-lg mb-3">
        <FaCheckCircle />
        {isPickup ? "Самовывоз" : "Доставка"}
      </h3>

      {/* ADDRESS */}
      {address ? (
        <>
          <div className="bg-white border rounded-lg p-3 flex justify-between items-start gap-3">

            <div className="flex-1">

              <p className="text-xs text-slate-500">
                {isPickup
                  ? "Адрес ресторана (самовывоз)"
                  : "Адрес доставки"}
              </p>

              <p className="font-semibold text-slate-900 wrap-break-words">
                {address}
              </p>

            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-xs shrink-0"
            >
              <FaCopy />
              копировать
            </button>

          </div>

          {isPickup && pickupMapUrl && (
            <a
              href={pickupMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-sm font-semibold text-green-700 underline hover:text-green-900"
            >
              Открыть в 2ГИС
            </a>
          )}
        </>

      ) : (

        <p className="text-sm text-slate-500">
          Адрес не указан
        </p>

      )}

    </div>
  )
}
