import { FaCheckCircle, FaCopy, FaMapMarkerAlt } from "react-icons/fa"
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
    <section className="border-b border-slate-200 py-4 sm:rounded-2xl sm:border sm:border-sky-100 sm:bg-white/88 sm:p-4 sm:shadow-sm">

      <div className="mb-4">
        <h3 className="flex items-center gap-2 text-xl font-extrabold leading-none text-slate-900 sm:text-lg">
          <FaCheckCircle className={isPickup ? "text-emerald-600" : "text-sky-600"} />
          {isPickup ? "Самовывоз" : "Доставка"}
        </h3>
      </div>

      {address ? (
        <>
          <div className="flex items-start justify-between gap-3 px-0 py-0 sm:rounded-xl sm:border sm:border-slate-100 sm:bg-slate-50 sm:px-3 sm:py-3">

            <div className="flex flex-1 gap-3">
              <div className={`mt-0.5 rounded-lg p-2 ${
                isPickup ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"
              }`}>
                <FaMapMarkerAlt size={14} />
              </div>

              <div className="flex-1">

                <p className="text-sm font-semibold leading-6 text-slate-900 wrap-break-word">
                  {address}
                </p>

                {!isPickup && ((order.apartment_office || order.apartment) || order.floor || order.address_2) && (
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
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
                  <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 ring-1 ring-amber-100">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-amber-700">
                      Комментарий клиента
                    </p>
                    <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">
                      {order.customer_note}
                    </p>
                  </div>
                )}
              </div>

            </div>

            <button
              onClick={handleCopy}
              className="shrink-0 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100 sm:self-start"
            >
              <FaCopy />
              Копировать
            </button>

          </div>

          {isPickup && pickupMapUrl && (
            <a
              href={pickupMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
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

    </section>
  )
}
