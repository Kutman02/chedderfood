import type { Order } from "../../../../types"

interface Props {
  order: Order
}

export const OrderNote = ({ order }: Props) => {

  if (!order.customer_note) return null

  return (

    <div className="bg-amber-50 rounded-xl p-4">

      <h3 className="text-lg font-black text-slate-900 mb-2">
        Примечание клиента
      </h3>

      <p className="text-sm text-slate-700">
        {order.customer_note}
      </p>

    </div>

  )

}