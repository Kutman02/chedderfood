import { FaTruck, FaStore } from "react-icons/fa"
import type { Order } from "../../../../types"

export const OrderTypeBadge = ({ order }: { order: Order }) => {

  const meta = order.meta_data?.find(m => m.key === "order_type")

  if (!meta) return null

  const isPickup = meta.value === "pickup"

  return (

    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-white
      ${isPickup ? "bg-green-600" : "bg-blue-600"}`}>

      {isPickup ? <FaStore size={16} /> : <FaTruck size={16} />}

      <span className="text-sm">
        {isPickup ? "Самовывоз" : "Доставка"}
      </span>

    </div>

  )

}