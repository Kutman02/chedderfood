 import { FaUser, FaPhone } from "react-icons/fa"
import type { Order } from "@/types"

interface Props {
  order: Order
}

export const OrderCustomerInfo = ({ order }: Props) => {

  const firstName = order.billing?.first_name || ""
  const lastName = order.billing?.last_name || ""
  const phone = order.billing?.phone || ""

  const fullName = `${firstName} ${lastName}`.trim()

  return (

    <div className="bg-white rounded-xl border border-slate-200 p-4">

      <h3 className="text-sm font-bold text-slate-500 mb-3">
        Клиент
      </h3>

      <div className="space-y-2">

        {/* Имя */}
        <div className="flex items-center gap-2 text-slate-800 font-semibold">

          <FaUser size={14} className="text-slate-400" />

          <span>
            {fullName || "Без имени"}
          </span>

        </div>

        {/* Телефон */}
        {phone && (

          <a
            href={`tel:${phone}`}
            className="flex items-center gap-2 text-orange-600 font-bold hover:underline"
          >

            <FaPhone size={14} />

            {phone}

          </a>

        )}

      </div>

    </div>

  )

}