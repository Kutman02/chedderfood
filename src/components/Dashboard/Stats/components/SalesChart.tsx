import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

interface DailyStat {
  date: string
  revenue: number
  orders: number
  items_sold: number
}

interface SalesChartProps {
  data: DailyStat[]
}

export const SalesChart = ({ data }: SalesChartProps) => {

  if (!data || data.length === 0) return null

  return (

    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">

      <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4">
        График продаж
      </h2>

      <ResponsiveContainer width="100%" height={320}>

        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
          />

          <YAxis
            tick={{ fontSize: 10 }}
          />

          <Tooltip
            formatter={(value: number | string | undefined, name: string | undefined) => {

              const numericValue = Number(value ?? 0)

              if (name === "revenue") {
                return [`${numericValue.toLocaleString()} сом`, "Выручка"]
              }

              if (name === "orders") {
                return [numericValue, "Заказы"]
              }

              return [numericValue, name ?? ""]
            }}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Выручка (сом)"
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="orders"
            stroke="#10b981"
            strokeWidth={2}
            name="Заказы"
            dot={false}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  )
}
