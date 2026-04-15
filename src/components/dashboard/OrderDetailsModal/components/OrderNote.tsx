import type { FC } from "react"

interface OrderNoteProps {
  note?: string
}

export const OrderNote: FC<OrderNoteProps> = ({ note }) => {
  if (!note?.trim()) return null

  return (
    <section className="rounded-2xl bg-amber-50 p-4 md:border md:border-amber-200 md:p-5 md:shadow-sm">

      <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
        Комментарий клиента
      </p>

      <h4 className="mb-2 mt-1 text-lg font-black text-slate-900">
        Что важно учесть
      </h4>

      <p className="text-sm leading-6 text-slate-700 whitespace-pre-wrap">
        {note}
      </p>

    </section>
  )
}