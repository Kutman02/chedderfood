import { FaTruck } from "react-icons/fa"
import type { Order } from "../../../../types"

interface Props {
  order: Order
}

export const OrderPricing = ({ order }: Props) => {

  return (

    <div className="bg-green-50 rounded-xl p-4">

      <div className="space-y-2">

        {order.shipping_total && parseFloat(order.shipping_total) > 0 && (

          <div className="flex justify-between items-center">

            <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <FaTruck size={12}/>
              Доставка:
            </span>

            <span className="text-sm font-bold">
              {order.shipping_total} {order.currency}
            </span>

          </div>

        )}

        <div className="flex justify-between items-center pt-2 border-t border-green-200">

          <span className="text-lg font-black text-slate-900">
            Итого:
          </span>

          <span className="text-2xl font-black text-green-600">
            {order.total} {order.currency}
          </span>

        </div>

      </div>

    </div>

  )

}