import { FaPhone } from "react-icons/fa"
import type { OrderCardHeaderProps } from "../types/orderCard.types"

export const OrderCardHeader = ({
  order,
  activeTabData
}: OrderCardHeaderProps) => {

  return (
    <div className="flex justify-between items-start mb-4">

      <div className="flex gap-3">

        <div
          className={`w-14 h-14 rounded-xl bg-linear-to-br ${activeTabData?.color}
          flex items-center justify-center text-white font-black`}
        >
          #{order.number}
        </div>

        <div>
          <h3 className="text-lg font-black">
            {order.billing.first_name} {order.billing.last_name}
          </h3>

          <a
            href={`tel:${order.billing.phone}`}
            className="text-orange-600 font-bold flex items-center gap-2"
          >
            <FaPhone size={12} />
            {order.billing.phone}
          </a>
        </div>

      </div>

      <div className="text-right">
        <p className="text-xs font-bold text-slate-400 uppercase">
          Сумма
        </p>
        <p className="text-lg font-black text-green-600">
          {order.total} сом
        </p>
      </div>

    </div>
  )
}