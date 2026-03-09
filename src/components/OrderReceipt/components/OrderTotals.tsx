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
    <div className="border-t-2 border-slate-200 pt-4">

      <div className="space-y-2">

        <div className="flex justify-between text-sm">
          <span className="text-slate-600">
            Подытог:
          </span>

          <span className="font-medium">
            {subtotal.toFixed(2)} сом
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-600">
            Доставка:
          </span>

          <span className="font-medium">
            {shippingCost > 0
              ? `${shippingCost.toFixed(2)} сом`
              : "Бесплатно"}
          </span>
        </div>

        <div className="flex justify-between text-lg font-bold text-orange-600 pt-2 border-t border-slate-200">
          <span>Итого:</span>

          <span>
            {total.toFixed(2)} сом
          </span>
        </div>

      </div>

    </div>
  )
}