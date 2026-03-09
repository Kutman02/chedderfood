import type { FC } from "react"

interface OrderTypeBlockProps {
  orderType: string
}

export const OrderTypeBlock: FC<OrderTypeBlockProps> = ({ orderType }) => {

  const isPickup = orderType === "pickup"

  return (
    <div
      className={`mb-6 rounded-lg p-4 border-2 flex items-center gap-4
      ${isPickup
        ? "bg-green-50 border-green-300"
        : "bg-blue-50 border-blue-300"
      }`}
    >

      <div className="text-5xl">
        {isPickup ? "🛍️" : "🚗"}
      </div>

      <div>
        <p className="text-xs text-slate-600 uppercase font-bold">
          Способ получения
        </p>

        <p
          className={`text-2xl font-black
          ${isPickup
            ? "text-green-700"
            : "text-blue-700"
          }`}
        >
          {isPickup
            ? "Заберу сам (самовывоз)"
            : "Доставка"
          }
        </p>
      </div>

    </div>
  )
}