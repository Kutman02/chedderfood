import type { Order } from "../../../../types"

interface Props {
  order: Order
}

export const OrderItemsList = ({ order }: Props) => {

  return (

    <div className="bg-white border-2 border-slate-200 rounded-xl p-4">

      <h3 className="text-lg font-black text-slate-900 mb-4">
        Товары в заказе
      </h3>

      <div className="space-y-3">

        {order.line_items?.map((item, index) => (

          <div
            key={index}
            className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0"
          >

            <div className="flex-1">
              <p className="font-semibold text-slate-900">
                {item.name}
              </p>

              <p className="text-sm text-slate-500">
                Количество: {item.quantity}
              </p>
            </div>

            <div className="text-right">
              <p className="font-black text-green-600">
                {item.total} {order.currency}
              </p>

              <p className="text-xs text-slate-500">
                {item.price} {order.currency} за шт.
              </p>
            </div>

          </div>

        ))}

      </div>

    </div>

  )

}