import { FaPhone } from "react-icons/fa"
import type { OrderCardHeaderProps } from "../types/orderCard.types"

export const OrderCardHeader = ({
  order,
  activeTabData
}: OrderCardHeaderProps) => {

  const o = order as any // 🔥 FIX

  const customerName =
    o?.customer_name || "Клиент"

  const phone =
    o?.phone || ""

  const orderNumber =
    o?.number || o?.id || "—"

  const total =
    o?.total || "0"

  return (
    <div className="flex justify-between items-start mb-4">

      <div className="flex gap-3">

        <div
          className={`w-14 h-14 rounded-xl bg-linear-to-br ${activeTabData?.color}
          flex items-center justify-center text-white font-black`}
        >
          # {orderNumber}
        </div>

        <div>
          <h3 className="text-lg font-black">
            {customerName}
          </h3>

          {phone ? (
            <a
              href={`tel:${phone}`}
              className="text-orange-600 font-bold flex items-center gap-2"
            >
              <FaPhone size={12} />
              {phone}
            </a>
          ) : (
            <p className="text-sm text-slate-400">
              Нет номера
            </p>
          )}
        </div>

      </div>

      <div className="text-right">
        <p className="text-xs font-bold text-slate-400 uppercase">
          Сумма
        </p>
        <p className="text-lg font-black text-green-600">
          {total} сом
        </p>
      </div>

    </div>
  )
}