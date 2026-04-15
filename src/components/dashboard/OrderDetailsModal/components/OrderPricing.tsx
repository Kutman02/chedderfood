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

    <section className="py-4 sm:rounded-2xl sm:border sm:border-emerald-100 sm:bg-white/88 sm:p-4 sm:shadow-sm">

      <h3 className="mb-4 text-xl font-extrabold leading-none text-slate-900 sm:text-lg">
        Сумма заказа
      </h3>

      <div className="space-y-2">

        {/* Товары */}
        <div className="flex items-center justify-between">

          <span className="text-sm font-semibold text-slate-600">
            Товары
          </span>

          <span className="font-bold text-slate-900">
            {subtotal.toFixed(0)} {currency}
          </span>

        </div>

        {/* Доставка */}
        {shipping > 0 && (

          <div className="flex items-center justify-between">

            <span className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <FaTruck size={12} />
              Доставка
            </span>

            <span className="font-bold text-slate-900">
              {shipping.toFixed(0)} {currency}
            </span>

          </div>

        )}

        {/* Итог */}
        <div className="flex items-center justify-between border-t border-emerald-100 pt-3">

          <span className="text-lg font-black text-slate-900">
            Итого
          </span>

          <span className="text-2xl font-black text-orange-500 md:text-3xl">
            {total.toFixed(0)} {currency}
          </span>

        </div>

      </div>

    </section>

  )

}