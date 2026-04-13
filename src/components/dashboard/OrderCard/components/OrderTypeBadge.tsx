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
      className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-white ${
        isPickup ? "bg-green-600" : "bg-blue-600"
      }`}
    >

      {isPickup ? (
        <>
          <FaStore size={16} />
          <span className="text-sm">
            Заберу сам (самовывоз)
          </span>
        </>
      ) : (
        <>
          <FaTruck size={16} />
          <span className="text-sm">
            Доставка
          </span>
        </>
      )}

    </div>

  )

}
