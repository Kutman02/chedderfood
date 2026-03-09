import type { FC } from "react"

interface OrderNoteProps {
  note?: string
}

export const OrderNote: FC<OrderNoteProps> = ({ note }) => {
  if (!note) return null

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
      <h4 className="font-medium text-slate-800 mb-2">
        Примечание к заказу:
      </h4>

      <p className="text-sm text-slate-600">
        {note}
      </p>
    </div>
  )
}