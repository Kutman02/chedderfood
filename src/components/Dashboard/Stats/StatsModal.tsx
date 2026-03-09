
import { useState } from "react"
import { format, subDays } from "date-fns"

import { useAnalyticsData } from "./hooks/useAnalyticsData"


import { StatsHeader, StatsMetrics, SalesChart, TopCategories, TopProducts, CategoryPieChart  } from "./components"

interface StatsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const StatsModal = ({
  isOpen,
  onClose
}: StatsModalProps) => {

  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 30), "yyyy-MM-dd")
  )

  const [endDate, setEndDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  )

  const {
    analyticsData,
    loading
  } = useAnalyticsData(startDate, endDate)

  if (!isOpen) return null

  return (

    <div className="fixed inset-0 z-50 bg-white overflow-hidden">

      {/* HEADER */}

      <StatsHeader
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        onClose={onClose}
      />

      {/* CONTENT */}

      <div
        className="flex-1 overflow-y-auto"
        style={{ height: "calc(100vh - 120px)" }}
      >

        <div className="p-4 sm:p-6">

          {loading && (

            <div className="flex justify-center py-20">

              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />

            </div>

          )}

          {!loading && analyticsData && (

            <div className="space-y-6">

              <StatsMetrics data={analyticsData} />

              <SalesChart data={analyticsData.daily_stats} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <TopCategories
                  categories={analyticsData.categories}
                />

                <TopProducts
                  products={analyticsData.products}
                />

              </div>

              <CategoryPieChart
                categories={analyticsData.categories}
              />

            </div>

          )}

          {!loading && !analyticsData && (

            <div className="text-center py-20 text-slate-500">
              Нет данных для отображения
            </div>

          )}

        </div>

      </div>

    </div>

  )

}