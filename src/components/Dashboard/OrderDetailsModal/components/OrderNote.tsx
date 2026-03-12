import type { FC } from "react"

interface OrderNoteProps {
  note?: string
}

export const OrderNote: FC<OrderNoteProps> = ({ note }) => {
  if (!note?.trim()) return null

  return (
    <div className="mt-6 p-4 border-2 border-amber-200 bg-amber-50 rounded-xl">

      <h4 className="flex items-center gap-2 font-bold text-amber-800 mb-2">
        Комментарий к заказу
      </h4>

      <p className="text-sm text-slate-700 whitespace-pre-wrap">
        {note}
      </p>

    </div>
  )
}