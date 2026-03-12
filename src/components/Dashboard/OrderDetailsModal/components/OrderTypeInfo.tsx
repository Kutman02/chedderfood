import { FaCheckCircle, FaCopy } from "react-icons/fa"
import type { Order } from "@/types"

interface Props {
  order: Order
}

export const OrderTypeInfo = ({ order }: Props) => {

  const orderType = order.meta_data?.find(
    m => m.key === "order_type"
  )?.value

  if (!orderType) return null

  const isPickup = orderType === "pickup"

  const address =
    order.shipping?.address_1 ||
    order.billing?.address_1 ||
    order.meta_data?.find(m => m.key === "delivery_address")?.value ||
    ""

  const handleCopy = () => {
    if (!address) return
    navigator.clipboard.writeText(address)
  }

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

      {!isPickup && address && (

        <div className="bg-white border rounded-lg p-3 flex justify-between items-start gap-3">

          <div className="flex-1">

            <p className="text-xs text-slate-500">
              Адрес доставки
            </p>

            <p className="font-semibold text-slate-900">
              {address}
            </p>

          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-xs"
          >
            <FaCopy />
            копировать
          </button>

        </div>

      )}

    </div>
  )
}