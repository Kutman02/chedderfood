import { FaTruck } from "react-icons/fa"
import type { Order } from "@/types"

interface Props {
  order: Order
}

export const OrderPricing = ({ order }: Props) => {

  /* ===============================
     CALCULATIONS
  =============================== */

  const subtotal = Array.isArray(order.items)
    ? order.items.reduce(
        (sum, item) =>
          sum + Number(item.price) * Number(item.quantity),
        0
      )
    : 0

  const total = Number(order.total)

  // 🔥 fallback (пока нет shipping_total с backend)
  const shipping = Math.max(total - subtotal, 0)

  // 🔥 если добавишь в normalize → order.currency
  const currency =
    order.currency === "KGS"
      ? "сом"
      : "сом" // fallback (потом расширишь)

  /* ===============================
     RENDER
  =============================== */

  return (

    <div className="bg-white border-2 border-green-200 rounded-xl p-4">

      <h3 className="text-sm font-bold text-slate-500 mb-3">
        Сумма заказа
      </h3>

      <div className="space-y-2">

        {/* Товары */}
        <div className="flex justify-between items-center">

          <span className="text-sm font-semibold text-slate-600">
            Товары
          </span>

          <span className="font-bold text-slate-900">
            {subtotal.toFixed(0)} {currency}
          </span>

        </div>

        {/* Доставка */}
        {shipping > 0 && (

          <div className="flex justify-between items-center">

            <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <FaTruck size={12} />
              Доставка
            </span>

            <span className="font-bold text-slate-900">
              {shipping.toFixed(0)} {currency}
            </span>

          </div>

        )}

        {/* Итог */}
        <div className="flex justify-between items-center pt-3 border-t border-green-200">

          <span className="text-lg font-black text-slate-900">
            Итого
          </span>

          <span className="text-3xl font-black text-green-600">
            {total.toFixed(0)} {currency}
          </span>

        </div>

      </div>

    </div>

  )

}