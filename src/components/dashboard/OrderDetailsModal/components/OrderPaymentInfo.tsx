import { FaCreditCard } from "react-icons/fa"
import type { Order } from "@/types"

interface Props {
  order: Order
}

export const OrderPaymentInfo = ({ order: _order }: Props) => {

  const payment = "Оплата при получении"

  return (
    <div className="bg-purple-50 rounded-xl p-4">

      <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
        <FaCreditCard className="text-purple-600" />
        Способ оплаты
      </h3>

      <p className="text-sm font-semibold">
        {payment}
      </p>

    </div>
  )
}