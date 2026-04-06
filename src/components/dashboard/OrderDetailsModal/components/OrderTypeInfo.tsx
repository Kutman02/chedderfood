import { FaCheckCircle, FaCopy } from "react-icons/fa"
import type { Order } from "@/types"

interface Props {
  order: Order
}

export const OrderTypeInfo = ({ order }: Props) => {

  /* ===============================
     SAFE DATA
  =============================== */

  const orderType =
    order.order_type === "pickup" ? "pickup" : "delivery"

  const isPickup = orderType === "pickup"

  const addressRaw = isPickup
    ? order.pickup_address
    : order.address

  const address =
    addressRaw?.trim() || ""

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

        <div className="bg-white border rounded-lg p-3 flex justify-between items-start gap-3">

          <div className="flex-1">

            <p className="text-xs text-slate-500">
              {isPickup
                ? "Адрес самовывоза"
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

      ) : (

        <p className="text-sm text-slate-500">
          Адрес не указан
        </p>

      )}

    </div>
  )
}