import { FaTruck } from "react-icons/fa"
import type { Order } from "@/types"

interface Props {
  order: Order
}

export const OrderPricing = ({ order }: Props) => {

  /* ===============================
     CALCULATIONS
  =============================== */

  const normalizedItems = Array.isArray(order.items)
    ? order.items
    : Array.isArray(order.line_items)
      ? order.line_items
      : []

  const subtotal = normalizedItems.reduce(
    (sum, item) =>
      sum + Number(item.total || Number(item.price) * Number(item.quantity)),
    0
  )

  const parsedTotal = Number(order.total)
  const total = Number.isFinite(parsedTotal)
    ? parsedTotal
    : subtotal

  const shippingLine = Array.isArray(order.shipping_lines)
    ? order.shipping_lines[0]
    : undefined

  const shippingFromApi = Number(order.shipping_total)
  const shippingFromLine = Number(
    shippingLine?.total ?? shippingLine?.cost
  )

  const shipping = order.order_type === "pickup"
    ? 0
    : Number.isFinite(shippingFromApi)
      ? Math.max(shippingFromApi, 0)
      : Number.isFinite(shippingFromLine)
        ? Math.max(shippingFromLine, 0)
        : Math.max(total - subtotal, 0)

  const shippingLabel =
    order.order_type === "pickup"
      ? "Самовывоз"
      : shippingLine?.label || "Доставка"

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
        <div className="flex items-center justify-between">

          <span className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <FaTruck size={12} />
            {shippingLabel}
          </span>

          {shipping > 0 ? (
            <span className="font-bold text-slate-900">
              {shipping.toFixed(0)} {currency}
            </span>
          ) : (
            <span className="font-bold text-emerald-600">
              Бесплатно
            </span>
          )}

        </div>

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