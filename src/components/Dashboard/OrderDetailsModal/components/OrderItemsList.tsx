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

      <div className="space-y-3">

        {order.line_items.map((item) => {

          const image =
            (item as any)?.image?.src ||
            "/placeholder-food.png"

          return (
            <div
              key={item.id ?? `${item.name}-${item.price}`}
              className="flex items-center gap-4 p-3 border border-slate-100 rounded-lg"
            >

              {/* Фото */}
              <img
                src={image}
                alt={item.name}
                className="w-14 h-14 object-cover rounded-lg border"
              />

              {/* Название */}
              <div className="flex-1">

                <p className="font-bold text-slate-900 text-sm">
                  {item.name}
                </p>

                {item.price && (
                  <p className="text-xs text-slate-500">
                    {item.price} {order.currency} / шт
                  </p>
                )}

              </div>

              {/* Количество */}
              <div className="text-xl font-black text-orange-600 min-w-40px text-center">
                {item.quantity}×
              </div>

              {/* Сумма */}
              <div className="text-right min-w-80px">

                <p className="text-lg font-black text-green-600">
                  {item.total} {order.currency}
                </p>

              </div>

            </div>
          )
        })}

      </div>

    </div>
  )
}