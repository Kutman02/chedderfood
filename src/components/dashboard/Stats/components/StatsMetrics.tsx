import {
  FaDollarSign,
  FaShoppingCart,
  FaChartLine,
  FaClock,
  FaBox,
  FaTimes
} from "react-icons/fa"

interface StatsMetricsProps {
  data: {
    revenue: number
    orders: number
    average_order_value: number
    pending_orders: number
    processing_orders: number
    cancelled_orders: number
  }
}

export const StatsMetrics = ({ data }: StatsMetricsProps) => {

  return (

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">

      {/* Выручка */}

      <div className="bg-linear-to-r from-green-500 to-green-600 rounded-xl p-3 sm:p-4 text-white">

        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <FaDollarSign size={14} />
          <span className="text-xs sm:text-sm font-medium opacity-90">
            Чистая выручка
          </span>
        </div>

        <p className="text-lg sm:text-2xl font-bold">
          {data.revenue.toLocaleString()} сом
        </p>

      </div>

      {/* Заказы */}

      <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-xl p-3 sm:p-4 text-white">

        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <FaShoppingCart size={14} />
          <span className="text-xs sm:text-sm font-medium opacity-90">
            Всего заказов
          </span>
        </div>

        <p className="text-lg sm:text-2xl font-bold">
          {data.orders.toLocaleString()}
        </p>

      </div>

      {/* Средний чек */}

      <div className="bg-linear-to-r from-orange-500 to-orange-600 rounded-xl p-3 sm:p-4 text-white">

        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <FaChartLine size={14} />
          <span className="text-xs sm:text-sm font-medium opacity-90">
            Средний чек
          </span>
        </div>

        <p className="text-lg sm:text-2xl font-bold">
          {Math.round(data.average_order_value).toLocaleString()} сом
        </p>

      </div>

      {/* Ожидают */}

      <div className="bg-linear-to-r from-yellow-500 to-yellow-600 rounded-xl p-3 sm:p-4 text-white">

        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <FaClock size={14} />
          <span className="text-xs sm:text-sm font-medium opacity-90">
            Ожидают
          </span>
        </div>

        <p className="text-lg sm:text-2xl font-bold">
          {data.pending_orders.toLocaleString()}
        </p>

      </div>

      {/* Готовятся */}

      <div className="bg-linear-to-r from-purple-500 to-purple-600 rounded-xl p-3 sm:p-4 text-white">

        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <FaBox size={14} />
          <span className="text-xs sm:text-sm font-medium opacity-90">
            Готовятся
          </span>
        </div>

        <p className="text-lg sm:text-2xl font-bold">
          {data.processing_orders.toLocaleString()}
        </p>

      </div>

      {/* Отменено */}

      <div className="bg-linear-to-r from-red-500 to-red-600 rounded-xl p-3 sm:p-4 text-white">

        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <FaTimes size={14} />
          <span className="text-xs sm:text-sm font-medium opacity-90">
            Отменено
          </span>
        </div>

        <p className="text-lg sm:text-2xl font-bold">
          {data.cancelled_orders.toLocaleString()}
        </p>

      </div>

    </div>

  )

}