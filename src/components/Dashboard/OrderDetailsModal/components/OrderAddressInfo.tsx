import { FaMapMarkerAlt } from "react-icons/fa"
import type { Order } from "@/types"

interface Props {
  order: Order
}

export const OrderAddressInfo = ({ order }: Props) => {

  const address =
    order.shipping?.address_1
      ? order.shipping
      : order.billing

  if (!address?.address_1) return null

  return (

    <div className="bg-blue-50 rounded-xl p-4">

      {/* <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
        <FaMapMarkerAlt className="text-blue-600" />
        Адрес доставки
      </h3> */}

      <p className="text-sm font-semibold mb-1">
        {address.address_1}
      </p>

      {address.address_2 && (
        <p className="text-sm text-slate-600">
          {address.address_2}
        </p>
      )}

      <p className="text-sm text-slate-600 mt-2">
        {address.city} {address.postcode}
      </p>

    </div>

  )

}