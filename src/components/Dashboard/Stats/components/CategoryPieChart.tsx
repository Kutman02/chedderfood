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

      <ResponsiveContainer width="100%" height={320}>

        <PieChart>

          <Pie
            data={categories}
            cx="50%"
            cy="50%"
            outerRadius="120"
            dataKey="revenue"
            nameKey="name"
            label={({ name, percent }: { name?: string; percent?: number }) =>
              `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
            }
          >

            {categories.map((_, index) => (
              <Cell
                key={categories[index].name}
                fill={COLORS[index % COLORS.length]}
              />
            ))}

          </Pie>

         <Tooltip
  formatter={(value, name) => {
    const normalized = Array.isArray(value)
      ? value[0]
      : value;

    return [`${Number(normalized ?? 0).toLocaleString()} сом`, name];
  }}
/>

        </PieChart>

      </ResponsiveContainer>

    </div>

  )
}
