import type { FC } from "react"
import type { OrderItemWithImage } from "../types"

interface OrderItemsTableProps {
  items: OrderItemWithImage[]
}

const formatPrice = (price: number) => `${price.toFixed(2)} сом`

export const OrderItemsTable: FC<OrderItemsTableProps> = ({ items }) => {
  return (
    <div>

      <h3 className="font-bold text-slate-900 text-lg mb-4">
        Ваш заказ
      </h3>

      <div className="space-y-4">

        {items.map((item, index) => {

          const key = `${item.name}-${index}`

          return (
            <div
              key={key}
              className="flex items-center gap-4 border-b border-slate-200 pb-4 last:border-none"
            >

              <img
                src={item.image || item.fallback}
                alt={item.name}
                loading="lazy"
                className="
                  w-14 h-14
                  object-cover
                  rounded-xl
                  bg-slate-100
                  shrink-0
                "
                onError={(e) => {
                  const target = e.target as HTMLImageElement

                  if (item.fallback && target.src !== item.fallback) {
                    target.src = item.fallback
                  }
                }}
              />

              <div className="flex-1 min-w-0">

                <p className="font-semibold text-slate-800 truncate">
                  {item.name}
                </p>

                <p className="text-sm text-slate-500">
                  {item.quantity} × {formatPrice(Number(item.price))}
                </p>

              </div>

              <div className="text-right">

                <p className="font-bold text-slate-900">
                  {formatPrice(item.total)}
                </p>

              </div>

            </div>
          )
        })}

      </div>

    </div>
  )
}