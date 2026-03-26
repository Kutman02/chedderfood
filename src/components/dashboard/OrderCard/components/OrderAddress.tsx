import { FaMapMarkerAlt } from "react-icons/fa"
import type { OrderAddressProps } from "../types/orderCard.types"

export const OrderAddress = ({
  order,
  activeTabData
}: OrderAddressProps) => {

  return (

    <div className={`${activeTabData?.bgColor} p-3 rounded-xl border`}>

      <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
        <FaMapMarkerAlt />
        Адрес:
      </p>

      <p className="text-sm font-semibold">
        {order.billing.address_1}
      </p>

    </div>

  )
}