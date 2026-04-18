import { FaCheckCircle, FaCopy, FaExternalLinkAlt, FaMapMarkerAlt } from "react-icons/fa"
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
    <section className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:p-5">

      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-extrabold leading-none text-slate-900 sm:text-xl">
          <FaCheckCircle className={isPickup ? "text-emerald-600" : "text-sky-600"} />
          {isPickup ? "Самовывоз" : "Доставка"}
        </h3>

        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
          isPickup
            ? "bg-emerald-100 text-emerald-700"
            : "bg-sky-100 text-sky-700"
        }`}>
          {isPickup ? "Pickup" : "Delivery"}
        </span>
      </div>

      {address ? (
        <div className="rounded-2xl border border-slate-200 bg-linear-to-b from-white to-slate-50 p-3 sm:p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">

            <div className="flex min-w-0 flex-1 items-start gap-3">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                isPickup ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"
              }`}>
                <FaMapMarkerAlt size={16} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {isPickup ? "Адрес ресторана" : "Адрес доставки"}
                </p>

                <p className="mt-1 wrap-break-word text-base font-bold leading-6 text-slate-900">
                  {address}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100"
              >
                <FaCopy size={12} />
                Копировать
              </button>

              {isPickup && pickupMapUrl && (
                <a
                  href={pickupMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  <FaExternalLinkAlt size={11} />
                  Открыть в 2ГИС
                </a>
              )}
            </div>
          </div>

          {!isPickup && ((order.apartment_office || order.apartment) || order.floor || order.address_2) && (
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
              {(order.apartment_office || order.apartment) && (
                <span className="rounded-full bg-white px-2.5 py-1 font-semibold shadow-sm ring-1 ring-slate-200">
                  Квартира/офис: {order.apartment_office || order.apartment}
                </span>
              )}
              {order.floor && (
                <span className="rounded-full bg-white px-2.5 py-1 font-semibold shadow-sm ring-1 ring-slate-200">
                  Этаж: {order.floor}
                </span>
              )}
              {order.address_2 && (
                <span className="rounded-full bg-white px-2.5 py-1 font-semibold shadow-sm ring-1 ring-slate-200">
                  Доп. адрес: {order.address_2}
                </span>
              )}
            </div>
          )}

          {order.customer_note?.trim() && (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-amber-700">
                Комментарий клиента
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                {order.customer_note}
              </p>
            </div>
          )}
        </div>

      ) : (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-sm text-slate-500">
          Адрес не указан
        </p>
      )}

    </section>
  )
}
