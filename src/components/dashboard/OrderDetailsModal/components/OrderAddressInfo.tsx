import type { Order } from "@/types"
import { FaMapMarkerAlt } from "react-icons/fa"

interface Props {
  order: Order
}

export const OrderAddressInfo = ({ order }: Props) => {

  const address = order.address

  if (!address?.trim()) return null

  return (

    <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">

      <h3 className="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2">
        <FaMapMarkerAlt className="text-blue-600" />
        Адрес доставки
      </h3>

      <p className="text-sm font-semibold text-slate-900">
        {address}
      </p>

    </div>

  )

}
