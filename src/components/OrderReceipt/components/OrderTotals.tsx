import type { FC } from "react"

interface OrderTotalsProps {
  subtotal: number
  shippingCost: number
  total: number
}

export const OrderTotals: FC<OrderTotalsProps> = ({
  subtotal,
  shippingCost,
  total,
}) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">

      <div className="space-y-3">

        <div className="flex justify-between text-sm text-slate-600">
          <span>Товары</span>

          <span className="font-medium text-slate-800">
            {subtotal.toFixed(2)} сом
          </span>
        </div>

        <div className="flex justify-between text-sm text-slate-600">
          <span>Доставка</span>

          {shippingCost > 0 ? (
            <span className="font-medium text-slate-800">
              {shippingCost.toFixed(2)} сом
            </span>
          ) : (
            <span className="font-medium text-green-600">
              Бесплатно
            </span>
          )}
        </div>

        <div className="border-t border-slate-200 pt-3 flex justify-between items-center">

          <span className="text-lg font-semibold text-slate-800">
            Итого
          </span>

          <span className="text-2xl font-black text-orange-600">
            {total.toFixed(2)} сом
          </span>

        </div>

      </div>

    </div>
  )
}