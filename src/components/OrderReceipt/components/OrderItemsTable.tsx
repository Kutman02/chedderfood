import type { FC } from "react"
import type { OrderItemWithImage } from "../types"

interface OrderItemsTableProps {
  items: OrderItemWithImage[]
}

export const OrderItemsTable: FC<OrderItemsTableProps> = ({ items }) => {
  return (
    <div className="mb-6">
      <h3 className="font-bold text-slate-800 mb-3">
        Заказанные товары
      </h3>

      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-slate-700">
                Товар
              </th>

              <th className="text-center p-3 text-sm font-medium text-slate-700">
                Количество
              </th>

              <th className="text-right p-3 text-sm font-medium text-slate-700">
                Цена
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr
                key={index}
                className="border-t border-slate-200"
              >
                <td className="p-3">
                  <div className="flex items-center gap-3">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        if (item.fallback) {
                          target.src = item.fallback
                        }
                      }}
                    />

                    <span className="font-medium text-sm">
                      {item.name}
                    </span>

                  </div>
                </td>

                <td className="p-3 text-center font-medium">
                  {item.quantity}
                </td>

                <td className="p-3 text-right font-medium">
                  {item.total.toFixed(2)} сом
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}