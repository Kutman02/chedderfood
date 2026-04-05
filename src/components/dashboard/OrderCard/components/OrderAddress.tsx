import { FaMapMarkerAlt } from "react-icons/fa"
import type { OrderAddressProps } from "../types/orderCard.types"

export const OrderAddress = ({
  order,
  activeTabData
}: OrderAddressProps) => {

  const o = order as any // 🔥 временный фикс

  const address =
    o?.address ||
    o?.shipping_address ||
    o?.billing?.address_1 ||
    "Адрес не указан"

  return (

    <div className={`${activeTabData?.bgColor} p-3 rounded-xl border`}>

      <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
        <FaMapMarkerAlt />
        Адрес:
      </p>

      <p className="text-sm font-semibold">
        {address}
      </p>

    </div>

  )
}