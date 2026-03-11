import { FaCheckCircle } from "react-icons/fa"
import type { Order } from "@/types"
import { OrderAddressInfo } from "./OrderAddressInfo"

interface Props {
  order: Order
}

export const OrderTypeInfo = ({ order }: Props) => {

  const meta = order.meta_data?.find(m => m.key === "order_type")

  if (!meta) return null

  const isPickup = meta.value === "pickup"

  return (

    <div className={`rounded-xl p-4 border-2 ${
      isPickup
        ? "bg-green-50 border-green-200"
        : "bg-blue-50 border-blue-200"
    }`}>

      <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
        <FaCheckCircle className={isPickup ? "text-green-600" : "text-blue-600"} />
        {isPickup ? "Заберу сам (самовывоз)" : "Доставка"}
      </h3>

      <p className={`text-sm font-semibold ${
        isPickup ? "text-green-700" : "text-blue-700"
      }`}>
        {isPickup
          ? "Клиент заберет заказ в ресторане"
          : "Доставка осуществляется по адресу"}
          <OrderAddressInfo order={order} />
          
      </p>

    </div>

  )

}