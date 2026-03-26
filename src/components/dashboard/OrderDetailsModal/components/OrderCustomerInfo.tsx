import { FaUser, FaPhone, FaCopy } from "react-icons/fa"
import type { Order } from "@/types"

interface Props {
  order: Order
}

export const OrderCustomerInfo = ({ order }: Props) => {

  const firstName = order.billing?.first_name || ""
  const lastName = order.billing?.last_name || ""
  const phone = order.billing?.phone || ""

  const fullName = `${firstName} ${lastName}`.trim()

  const handleCopyPhone = () => {
    if (!phone) return
    navigator.clipboard.writeText(phone)
  }

  return (

    <div className="bg-white rounded-xl border border-slate-200 p-4">

      <h3 className="text-sm font-bold text-slate-500 mb-3">
        Клиент
      </h3>

      <div className="space-y-3">

        {/* Имя */}
        <div className="flex items-center gap-2 text-slate-900 font-semibold">

          <FaUser className="text-slate-400" />

          <span className="text-base">
            {fullName || "Без имени"}
          </span>

        </div>

        {/* Телефон */}
        {phone && (

          <div className="flex items-center justify-between bg-slate-50 border rounded-lg px-3 py-2">

            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-orange-600 font-bold"
            >
              <FaPhone />
              {phone}
            </a>

            <button
              onClick={handleCopyPhone}
              className="flex items-center gap-1 text-xs bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded"
            >
              <FaCopy />
              копировать
            </button>

          </div>

        )}

      </div>

    </div>

  )
}