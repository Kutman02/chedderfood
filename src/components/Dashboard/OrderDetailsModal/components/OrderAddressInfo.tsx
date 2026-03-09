import { FaMapMarkerAlt } from "react-icons/fa"
import type { Order } from "@/types"

interface Props {
  order: Order
}

export const OrderAddressInfo = ({ order }: Props) => {

  return (

    <div className="bg-blue-50 rounded-xl p-4">

      <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
        <FaMapMarkerAlt className="text-blue-600"/>
        Адрес
      </h3>

      <p className="text-sm font-semibold mb-1">
        {order.billing.address_1}
      </p>

      {order.billing.address_2 && (
        <p className="text-sm text-slate-600">
          {order.billing.address_2}
        </p>
      )}

      <p className="text-sm text-slate-600 mt-2">
        {order.billing.city}, {order.billing.postcode}
      </p>

    </div>

  )

}