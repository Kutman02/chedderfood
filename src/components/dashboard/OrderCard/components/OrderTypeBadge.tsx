import { FaTruck, FaStore } from "react-icons/fa"
import type { Order } from "@/types"

interface OrderTypeBadgeProps {
  order: Order
}

export const OrderTypeBadge = ({ order }: OrderTypeBadgeProps) => {
  const normalizedType = (order.order_type || "").trim().toLowerCase()

  const isPickup =
    normalizedType === "pickup" ||
    normalizedType === "local_pickup" ||
    normalizedType.includes("самовывоз") ||
    Boolean(order.pickup_address)

  return (

    <div
      className={`flex min-h-12 items-center gap-2 rounded-xl px-3 py-3 font-bold text-white sm:min-h-0 sm:py-2 ${
        isPickup ? "bg-green-600" : "bg-blue-600"
      }`}
    >

      {isPickup ? (
        <>
          <FaStore size={16} />
          <span className="text-base sm:text-sm">
            Заберу сам (самовывоз)
          </span>
        </>
      ) : (
        <>
          <FaTruck size={16} />
          <span className="text-base sm:text-sm">
            Доставка
          </span>
        </>
      )}

    </div>

  )

}
