import { IoFastFood } from "react-icons/io5"

type OrderItemView = {
  id: number
  name: string
  quantity: number
  price: string
  total: number
}

interface Props {
  items: OrderItemView[]
}

export const OrderItemsList = ({ items }: Props) => {

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <section className="py-4 sm:rounded-2xl sm:border sm:border-slate-200 sm:bg-white/80 sm:p-4 sm:shadow-sm">
        <h3 className="mb-2 text-lg font-black text-slate-900">
          <IoFastFood className="mr-2 inline" />
          Состав заказа
        </h3>
        <div className="py-6 text-center text-sm text-red-500">
          Не удалось загрузить позиции заказа.
        </div>
      </section>
    )
  }

  return (
    <section className="border-b border-slate-200 py-4 sm:rounded-2xl sm:border sm:border-slate-200 sm:bg-white/88 sm:p-4 sm:shadow-sm">

      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-xl font-extrabold leading-none text-slate-900 sm:text-lg">
          <IoFastFood className="mr-2 inline" />
          Состав заказа
        </h3>

        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
          {items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)} шт.
        </span>
      </div>

      <div className="space-y-3">

        {items.map((item) => {
          return (
            <div
              key={item.id}
              className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 rounded-xl bg-white px-0 py-3 first:pt-0 last:pb-0 sm:border sm:border-slate-100 sm:bg-slate-50 sm:px-3 sm:py-3 sm:first:pt-3 sm:last:pb-3"
            >

              <div className="min-w-0">
                <p className="wrap-break-word text-sm font-bold text-slate-900 md:text-base">
                  {item.name}
                </p>
                <p className="mt-1 text-xs text-slate-500 md:text-sm">
                  {item.price} сом за 1 шт
                </p>
              </div>

              <p className="min-w-14 text-right text-sm font-black text-orange-600 md:text-base">
                {item.quantity} шт
              </p>

              <p className="min-w-18 text-right text-base font-black text-emerald-600 md:text-lg">
                {item.total} сом
              </p>
              </div>
          )
        })}

      </div>

    </section>
  )
}