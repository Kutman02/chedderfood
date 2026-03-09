import { FaBox, FaDollarSign, FaChartLine } from "react-icons/fa"
import { StatsCard } from "./components"

interface StatsProps {
  stats: {
    count: number
    total: number
  }
}

export const Stats = ({ stats }: StatsProps) => {

  const averageCheck =
    stats.count > 0
      ? (stats.total / stats.count).toFixed(0)
      : 0

  return (

    <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200/50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <StatsCard
            title="Заказов сегодня"
            value={stats.count}
            icon={FaBox}
            gradient="from-blue-500 to-blue-600"
          />

          <StatsCard
            title="Сумма сегодня"
            value={`${stats.total.toFixed(0)} сом`}
            icon={FaDollarSign}
            gradient="from-green-500 to-green-600"
          />

          <StatsCard
            title="Средний чек"
            value={`${averageCheck} сом`}
            icon={FaChartLine}
            gradient="from-orange-500 to-orange-600"
          />

        </div>

      </div>

    </div>

  )

}