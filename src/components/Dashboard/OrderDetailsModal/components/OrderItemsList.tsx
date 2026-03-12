import type { Order } from "@/types"

interface Props {
  order: Order
}

export const OrderItemsList = ({ order }: Props) => {

  if (!order.line_items?.length) return null

  return (

    <div className="bg-white border-2 border-slate-200 rounded-xl p-4">

      <h3 className="text-lg font-black text-slate-900 mb-4">
        🍽 Заказанные блюда
      </h3>

      <div className="space-y-4">

        {order.line_items.map((item) => (

          <div
            key={item.id ?? `${item.name}-${item.price}`}
            className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0"
          >

            {/* Левая часть */}
            <div className="flex items-center gap-3 flex-1">

              <div className="text-lg font-black text-slate-900 min-w-40px">
                {item.quantity}×
              </div>

              <div>

                <p className="font-semibold text-slate-900">
                  {item.name}
                </p>

                {item.price && (
                  <p className="text-xs text-slate-500">
                    {item.price} {order.currency} за шт.
                  </p>
                )}

              </div>

            </div>

            {/* Правая часть */}
            <div className="text-right">

              <p className="text-lg font-black text-green-600">
                {item.total} {order.currency}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}