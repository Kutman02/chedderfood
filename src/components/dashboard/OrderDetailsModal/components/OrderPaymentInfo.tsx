import { FaCreditCard } from "react-icons/fa"
import type { Order } from "@/types"

interface Props {
  order: Order
}

export const OrderPaymentInfo = ({ order: _order }: Props) => {

  const payment = "Оплата при получении"

  return (
    <section className="border-b border-slate-200 py-4 sm:rounded-2xl sm:border sm:border-violet-100 sm:bg-white/88 sm:p-4 sm:shadow-sm">

      <h3 className="mb-4 flex items-center gap-2 text-xl font-extrabold leading-none text-slate-900 sm:text-lg">
        <FaCreditCard className="text-violet-600" />
        Оплата
      </h3>

      <p className="rounded-xl bg-violet-50 px-3 py-3 text-sm font-semibold text-slate-900 sm:bg-violet-50">
        {payment}
      </p>

    </section>
  )
}