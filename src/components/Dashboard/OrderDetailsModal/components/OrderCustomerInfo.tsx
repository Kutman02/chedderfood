import { FaPhone, FaCalendar } from "react-icons/fa"
import type { Order } from "../../../../types"

interface Props {
  order: Order
}

export const OrderCustomerInfo = ({ order }: Props) => {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)

    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (

    <div className="bg-slate-50 rounded-xl p-4">

      <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
        <FaPhone className="text-orange-600" />
        Информация о клиенте
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">
            Имя
          </p>
          <p className="text-sm font-semibold">
            {order.billing.first_name} {order.billing.last_name}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">
            Телефон
          </p>

          <a
            href={`tel:${order.billing.phone}`}
            className="text-sm font-semibold text-orange-600"
          >
            {order.billing.phone}
          </a>
        </div>

        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">
            Дата заказа
          </p>

          <p className="text-sm font-semibold flex items-center gap-2">
            <FaCalendar size={12}/>
            {formatDate(order.date_created)}
          </p>
        </div>

      </div>

    </div>

  )

}