import { IoFastFood } from "react-icons/io5"

type OrderItemView = {
  id: number
  name: string
  image?: string
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

        <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-orange-100">
          {items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)} шт.
        </span>
      </div>

      <div className="space-y-3">

        {items.map((item) => {
          const image = item.image?.trim() || "/placeholder-image.jpg"

          return (
            <div
              key={item.id}
              className="grid grid-cols-[56px_minmax(0,1fr)_auto_auto] items-center gap-3 rounded-xl border border-slate-600 bg-slate-800 px-3 py-3 first:pt-3 last:pb-3"
            >

              <img
                src={image}
                alt={item.name}
                className="h-14 w-14 rounded-lg border border-slate-600 object-cover"
                loading="lazy"
              />

              <div className="min-w-0">
                <p className="wrap-break-word text-sm font-bold text-white md:text-base">
                  {item.name}
                </p>
                <p className="mt-1 text-xs text-slate-300 md:text-sm">
                  {item.price} сом за 1 шт
                </p>
              </div>

              <p className="min-w-14 text-right text-sm font-black text-orange-300 md:text-base">
                {item.quantity} шт
              </p>

              <p className="min-w-18 text-right text-base font-black text-emerald-300 md:text-lg">
                {item.total} сом
              </p>
              </div>
          )
        })}

      </div>

    </section>
  )
}