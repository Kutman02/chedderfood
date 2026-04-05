import { IoFastFood } from "react-icons/io5"

type OrderItemView = {
  id: number
  name: string
  image: string
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
      <div className="text-center text-slate-400 py-6">
        Нет товаров
      </div>
    )
  }

  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl p-4">

      <h3 className="text-lg font-black text-slate-900 mb-4">
        <IoFastFood className="inline mr-2" />
        Заказанные блюда
      </h3>

      <div className="space-y-3">

        {items.map((item) => {

          const image =
            item.image && item.image.trim() !== ""
              ? item.image
              : "/placeholder-food.png"

          return (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3 border border-slate-100 rounded-lg"
            >

              {/* Фото */}
              <img
                src={image}
                alt={item.name}
                className="w-14 h-14 object-cover rounded-lg border"
              />

              {/* Название */}
              <div className="flex-1">

                <p className="font-bold text-slate-900 text-sm">
                  {item.name}
                </p>

                <p className="text-xs text-slate-500">
                  {item.price} сом / шт
                </p>

              </div>

              {/* Количество */}
              <div className="text-xl font-black text-orange-600 text-center min-w-[40px]">
                {item.quantity}×
              </div>

              {/* Сумма */}
              <div className="text-right min-w-[80px]">

                <p className="text-lg font-black text-green-600">
                  {item.total} сом
                </p>

              </div>

            </div>
          )
        })}

      </div>

    </div>
  )
}