import type { FC } from "react"
import type { Order } from "@/types"

interface OrderTypeBlockProps {
  order: Order
}

export const OrderTypeBlock: FC<OrderTypeBlockProps> = ({ order }) => {

  const orderType = order.order_type || "delivery"

  const isPickup = orderType === "pickup"
  const pickupAddress = order.pickup_address?.trim() || order.address?.trim() || ""
  const pickupMapUrl = order.pickup_map_url?.trim() || ""

  return (
    <div
      className={`mb-6 rounded-lg p-4 border-2 flex items-center gap-4
      ${isPickup
        ? "bg-green-50 border-green-300"
        : "bg-blue-50 border-blue-300"
      }`}
    >

      <div className="text-5xl">
        {isPickup ? "🛍️" : "🚗"}
      </div>

      <div>
        <p className="text-xs text-slate-600 uppercase font-bold">
          Способ получения
        </p>

        <p
          className={`text-2xl font-black
          ${isPickup
            ? "text-green-700"
            : "text-blue-700"
          }`}
        >
          {isPickup
            ? "Заберу сам (самовывоз)"
            : "Доставка"
          }
        </p>

        {isPickup && pickupAddress && (
          <p className="text-sm text-green-800 mt-1">
            Адрес ресторана (самовывоз): {pickupAddress}
          </p>
        )}

        {isPickup && pickupMapUrl && (
          <a
            href={pickupMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-1 text-sm font-semibold text-green-700 underline hover:text-green-900"
          >
            Открыть в 2ГИС
          </a>
        )}
      </div>

    </div>
  )
}