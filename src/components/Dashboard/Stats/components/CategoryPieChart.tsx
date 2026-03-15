import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts"

import type { CategoryStat } from "../types"

interface Props {
  categories: CategoryStat[]
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899"
]

export const CategoryPieChart = ({ categories }: Props) => {

  if (!categories || categories.length === 0) return null

  return (

    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">

      <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4">
        Распределение по категориям
      </h2>

      <div className="h-48 sm:h-64 lg:h-80">

        <ResponsiveContainer width="100%" aspect={1.6}>

          <PieChart>

            <Pie
              data={categories}
              cx="50%"
              cy="50%"
              outerRadius={90}
              dataKey="revenue"
              nameKey="name"
              label={({ name, percent }: { name?: string; percent?: number }) =>
                `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
            >

              {categories.map((_, index) => (

                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />

              ))}

            </Pie>

            <Tooltip
              formatter={(value: number | string | undefined) =>
                `${Number(value ?? 0).toLocaleString()} сом`
              }
            />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>

  )

}