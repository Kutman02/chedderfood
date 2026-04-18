import type { FC } from "react"
import { FaCheckCircle, FaCopy, FaExternalLinkAlt, FaMapMarkerAlt, FaStore, FaTruck } from "react-icons/fa"
import type { Order } from "@/types"

interface OrderTypeBlockProps {
  order: Order
}

export const OrderTypeBlock: FC<OrderTypeBlockProps> = ({ order }) => {

  const normalizedType = (order.order_type || "").trim().toLowerCase()

  const isPickup =
    normalizedType === "pickup" ||
    normalizedType === "local_pickup" ||
    normalizedType.includes("самовывоз")

  const pickupAddress = order.pickup_address?.trim() || order.address?.trim() || ""
  const pickupMapUrl = order.pickup_map_url?.trim() || ""

  const deliveryAddress = order.address?.trim() || ""

  const displayAddress = isPickup
    ? pickupAddress || "Адрес ресторана не указан"
    : deliveryAddress || "Адрес доставки не указан"

  const handleCopyAddress = async () => {
    if (!displayAddress) return

    try {
      await navigator.clipboard.writeText(displayAddress)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = displayAddress
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
    }
  }

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
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

      <div className="rounded-2xl border border-slate-200 bg-linear-to-b from-white to-slate-50 p-3 sm:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">

          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              isPickup ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"
            }`}>
              {isPickup ? <FaStore size={16} /> : <FaTruck size={16} />}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {isPickup ? "Адрес ресторана" : "Адрес доставки"}
              </p>

              <p className="mt-1 wrap-break-word text-base font-bold leading-6 text-slate-900">
                {displayAddress}
              </p>

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
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            <button
              type="button"
              onClick={handleCopyAddress}
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

      </div>

      {!isPickup && order.city?.trim() && (
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
          <FaMapMarkerAlt size={11} />
          {order.city.trim()}
        </div>
      )}

    </section>
  )
}