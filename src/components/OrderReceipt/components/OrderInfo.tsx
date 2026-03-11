import type { FC } from "react"
import type { PublicOrder } from "../../../types"

interface ShippingInfo {
  method: string
  address: string
  cost: number
  status: string
}

interface OrderInfoProps {
  order: PublicOrder
  formatDate: (date: string) => string
  shippingInfo: ShippingInfo
}

export const OrderInfo: FC<OrderInfoProps> = ({
  order,
  formatDate,
  shippingInfo,
}) => {
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-6">

      <div className="mb-4">

        <p className="text-sm text-slate-500">
          Заказ
        </p>

        <p className="text-2xl font-black text-orange-600">
          #{order.id}
        </p>

        <p className="text-sm text-slate-600">
          {formatDate(order.date_created)}
        </p>

      </div>

      <div className="space-y-4 text-sm">

        <div>
          <p className="text-slate-500">
            Способ оплаты
          </p>

          <p className="font-semibold text-slate-800">
            {order.payment_method_title || "Оплата при получении"}
          </p>
        </div>

        <div>
          <p className="text-slate-500">
            Способ получения
          </p>

          <p className="font-semibold text-orange-600">
            {shippingInfo.method}
          </p>
        </div>

        <div>
          <p className="text-slate-500">
            Адрес доставки
          </p>

          <p className="font-semibold text-slate-800">
            {shippingInfo.address}
          </p>
        </div>

      </div>

    </div>
  )
}