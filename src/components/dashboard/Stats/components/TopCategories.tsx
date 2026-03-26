import { FaTag } from "react-icons/fa"

interface Category {
  name: string
  items_sold: number
  revenue: number
  orders: number
}

interface TopCategoriesProps {
  categories: Category[]
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899"
]

export const TopCategories = ({
  categories
}: TopCategoriesProps) => {

  if (!categories || categories.length === 0) {
    return null
  }

  return (

    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">

      <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <FaTag size={14} />
        Лучшие категории фастфуда — по выручке
      </h2>

      <div className="space-y-2 sm:space-y-3">

        {categories.map((category, index) => (

          <div
            key={category.name}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-slate-50 rounded-lg gap-2"
          >

            {/* Название категории */}

            <div className="flex items-center gap-2">

              <div
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                style={{
                  backgroundColor:
                    COLORS[index % COLORS.length]
                }}
              />

              <span className="text-xs sm:text-sm font-medium text-slate-700">
                {category.name}
              </span>

            </div>

            {/* Статистика */}

            <div className="flex items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm">

              <span className="text-slate-600">
                {category.items_sold} шт.
              </span>

              <span className="font-bold text-green-600">
                {category.revenue.toLocaleString()} сом
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}