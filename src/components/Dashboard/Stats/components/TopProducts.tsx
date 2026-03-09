import { FaBox } from "react-icons/fa"

interface ProductStat {
  name: string
  items_sold: number
  revenue: number
  avg_price: number
}

interface TopProductsProps {
  products: ProductStat[]
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899"
]

export const TopProducts = ({ products }: TopProductsProps) => {

  if (!products || products.length === 0) {
    return null
  }

  return (

    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">

      <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <FaBox size={14} />
        Топ-10 блюд — по продажам
      </h2>

      <div className="space-y-2 sm:space-y-3">

        {products.map((product, index) => (

          <div
            key={`${product.name}-${index}`}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-slate-50 rounded-lg gap-2"
          >

            {/* Название блюда */}

            <div className="flex items-center gap-2">

              <div
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                style={{
                  backgroundColor:
                    COLORS[index % COLORS.length]
                }}
              />

              <div>
                <span className="text-xs sm:text-sm font-medium text-slate-700">
                  {product.name}
                </span>

                <span className="text-xs text-slate-500 ml-1 sm:ml-2">
                  ({product.avg_price.toFixed(0)} сом / шт)
                </span>
              </div>

            </div>

            {/* Статистика */}

            <div className="flex items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm">

              <span className="text-slate-600">
                {product.items_sold} шт.
              </span>

              <span className="font-bold text-green-600">
                {product.revenue.toLocaleString()} сом
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}