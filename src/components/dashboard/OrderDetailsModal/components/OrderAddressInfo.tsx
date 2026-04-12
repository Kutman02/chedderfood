import type { Order } from "@/types"
import { FaMapMarkerAlt } from "react-icons/fa"

interface Props {
  order: Order
}

export const OrderAddressInfo = ({ order }: Props) => {

  const address = order.address
  const address2 = order.address_2?.trim()
  const apartment = order.apartment?.trim()
  const floor = order.floor?.trim()
  const city = order.city?.trim()
  const postcode = order.postcode?.trim()

  if (!address?.trim() && !address2 && !apartment && !floor && !city && !postcode) {
    return null
  }

  return (

    <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">

      <h3 className="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2">
        <FaMapMarkerAlt className="text-blue-600" />
        Адрес доставки
      </h3>

      <p className="text-sm font-semibold text-slate-900">
        {address || "—"}
      </p>

      {(address2 || apartment || floor || city || postcode) && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {address2 && (
            <p className="text-slate-700">
              Доп. адрес: <span className="font-semibold text-slate-900">{address2}</span>
            </p>
          )}
          {apartment && (
            <p className="text-slate-700">
              Квартира/офис: <span className="font-semibold text-slate-900">{apartment}</span>
            </p>
          )}
          {floor && (
            <p className="text-slate-700">
              Этаж: <span className="font-semibold text-slate-900">{floor}</span>
            </p>
          )}
          {city && (
            <p className="text-slate-700">
              Город: <span className="font-semibold text-slate-900">{city}</span>
            </p>
          )}
          {postcode && (
            <p className="text-slate-700">
              Индекс: <span className="font-semibold text-slate-900">{postcode}</span>
            </p>
          )}
        </div>
      )}

    </div>

  )

}
