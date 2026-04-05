import type { FC } from "react"
import type { Order } from "@/entities/order/model/types"

interface ShippingInfo {
  method: string
  address: string
  cost: number
  status: string
}

interface OrderInfoProps {
  order: Order
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
          {order.date_created
            ? formatDate(order.date_created)
            : "-"}
        </p>

      </div>

      <div className="space-y-4 text-sm">

        {/* 🔥 У тебя нет payment_method → не выдумываем */}
        <div>
          <p className="text-slate-500">
            Оплата
          </p>

          <p className="font-semibold text-slate-800">
            Наличные / При получении
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
            Адрес
          </p>

          <p className="font-semibold text-slate-800">
            {order.address || "Не указан"}
          </p>
        </div>

      </div>

    </div>
  )
}