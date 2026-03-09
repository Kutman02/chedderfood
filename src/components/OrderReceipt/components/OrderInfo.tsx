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
    <div className="mb-6 bg-orange-50 rounded-lg p-4">
      <h3 className="font-bold text-slate-800 mb-3">
        Информация о заказе
      </h3>

      <div className="grid grid-cols-2 gap-4 text-sm">

        <div>
          <p className="text-slate-600">Номер счета:</p>
          <p className="font-bold text-lg">
            {order.id}
          </p>
        </div>

        <div>
          <p className="text-slate-600">Дата счета:</p>
          <p className="font-bold">
            {formatDate(order.date_created)}
          </p>
        </div>

        <div>
          <p className="text-slate-600">Номер заказа:</p>
          <p className="font-bold text-lg text-orange-600">
            #{order.id}
          </p>
        </div>

        <div>
          <p className="text-slate-600">Дата заказа:</p>
          <p className="font-bold">
            {formatDate(order.date_created)}
          </p>
        </div>

      </div>

      <div className="mt-3 pt-3 border-t border-orange-200">
        <p className="text-slate-600">Метод оплаты:</p>
        <p className="font-bold">
          {order.payment_method_title || "Оплата при получении"}
        </p>
      </div>

      <div className="mt-3 pt-3 border-t border-orange-200">
        <p className="text-slate-600">Способ получения:</p>
        <p className="font-bold text-lg text-orange-600">
          {shippingInfo.method}
        </p>
      </div>

      <div className="mt-3 pt-3 border-t border-orange-200">
        <p className="text-slate-600">Адрес:</p>
        <p className="font-bold text-sm">
          {shippingInfo.address}
        </p>
      </div>
    </div>
  )
}