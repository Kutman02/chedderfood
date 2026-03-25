import { FaStar, FaFire, FaGift } from "react-icons/fa"
import type { ProductStatus } from "@/types"

interface ProductStatusSelectorProps {
  value: ProductStatus
  onChange: (value: ProductStatus) => void
}

const PRODUCT_STATUSES = [
  {
    value: "hit",
    label: "Хит продаж",
    icon: FaFire,
    color: "from-red-500 to-red-600"
  },
  {
    value: "new",
    label: "Новинка",
    icon: FaStar,
    color: "from-blue-500 to-blue-600"
  },
  {
    value: "sale",
    label: "Скидка",
    icon: FaGift,
    color: "from-green-500 to-green-600"
  },
  {
    value: "none",
    label: "Без статуса",
    icon: null,
    color: "from-slate-400 to-slate-500"
  }
] as const

export const ProductStatusSelector = ({
  value,
  onChange
}: ProductStatusSelectorProps) => {

  return (

    <div>

      <label className="block text-sm font-black text-slate-700 mb-2">
        Статус товара
      </label>

      <div className="grid grid-cols-2 gap-2">

        {PRODUCT_STATUSES.map(status => {

          const Icon = status.icon

          const isActive = value === status.value

          return (

            <button
              key={status.value}
              type="button"
              onClick={() => onChange(status.value)}
              className={`p-3 rounded-xl border-2 transition-all
                ${
                  isActive
                    ? `bg-linear-to-r ${status.color} text-white border-transparent shadow-lg`
                    : "bg-white border-slate-200 text-slate-600 hover:border-orange-500"
                }
              `}
            >

              {Icon && (
                <div className="mx-auto mb-1">
                  <Icon size={16} />
                </div>
              )}

              <span className="text-xs font-bold">
                {status.label}
              </span>

            </button>

          )

        })}

      </div>

    </div>

  )

}