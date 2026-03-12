import type { FC } from "react"
import { FaBox, FaTruck } from "react-icons/fa"

interface OrderTotalsProps {
  subtotal: number
  shippingCost: number
  total: number
  currency?: string
}

export const OrderTotals: FC<OrderTotalsProps> = ({
  subtotal,
  shippingCost,
  total,
  currency = "KGS",
}) => {

  const format = (value: number) =>
    `${value.toFixed(2)} ${currency}`

  return (

    <div className="bg-white border-2 border-orange-200 rounded-xl p-4">

      <h3 className="text-sm font-bold text-slate-500 mb-3">
        Сумма заказа
      </h3>

      <div className="space-y-3">

        {/* Товары */}
        <div className="flex justify-between items-center">

          <span className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <FaBox size={12}/>
            Товары
          </span>

          <span className="font-bold text-slate-900">
            {format(subtotal)}
          </span>

        </div>

        {/* Доставка */}
        <div className="flex justify-between items-center">

          <span className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <FaTruck size={12}/>
            Доставка
          </span>

          {shippingCost > 0 ? (

            <span className="font-bold text-slate-900">
              {format(shippingCost)}
            </span>

          ) : (

            <span className="font-bold text-green-600">
              Бесплатно
            </span>

          )}

        </div>

        {/* Итог */}
        <div className="border-t border-orange-200 pt-3 flex justify-between items-center">

          <span className="text-lg font-black text-slate-900">
            ИТОГО
          </span>

          <span className="text-3xl font-black text-orange-600">
            {format(total)}
          </span>

        </div>

      </div>

    </div>

  )
}