import { useState } from "react"
import { format, subDays } from "date-fns"

import { useAnalyticsData } from "./hooks/useAnalyticsData"

import {
  StatsHeader,
  StatsMetrics,
  SalesChart,
  TopCategories,
  TopProducts,
  CategoryPieChart
} from "./components"

export const Stats = () => {

  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 30), "yyyy-MM-dd")
  )

  const [endDate, setEndDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  )

  const { analyticsData, loading } =
    useAnalyticsData(startDate, endDate)

  return (

    <div className="bg-slate-50 min-h-screen">

      <StatsHeader
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 min-w-0">

        {loading && (

          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>

        )}

        {!loading && analyticsData && (

          <div className="space-y-6 min-w-0">

            <StatsMetrics data={analyticsData} />

            {/* график */}
            <div className="min-w-0">
              <SalesChart data={analyticsData.daily_stats} />
            </div>

            {/* grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">

              <div className="min-w-0">
                <TopCategories
                  categories={analyticsData.categories}
                />
              </div>

              <div className="min-w-0">
                <TopProducts
                  products={analyticsData.products}
                />
              </div>

            </div>

            {/* pie chart */}
            <div className="min-w-0">
              <CategoryPieChart
                categories={analyticsData.categories}
              />
            </div>

          </div>

        )}

      </div>

    </div>

  )

}
