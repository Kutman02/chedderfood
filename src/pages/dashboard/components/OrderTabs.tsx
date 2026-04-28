import { useEffect, useState } from "react"

import type { OrderStatus } from "@/types"

interface OrderTabsProps {
  activeTab: OrderStatus
  setActiveTab: (tab: OrderStatus) => void
  counts: Record<OrderStatus, number | string>
}

const primaryTabs: Array<{ key: OrderStatus, label: string }> = [
  { key: "on-hold", label: "Новые" },
  { key: "processing", label: "Готовятся" },
  { key: "ready", label: "Готовые" },
]

const secondaryTabs: Array<{ key: OrderStatus, label: string }> = [
  { key: "completed", label: "Завершён" },
  { key: "cancelled", label: "Отменённые" }
]

const shouldShowTabCount = (status: OrderStatus) =>
  status !== "completed" && status !== "cancelled"

const isSecondaryStatus = (status: OrderStatus) =>
  status === "completed" || status === "cancelled"

const getPrimaryTabActiveClasses = (status: OrderStatus) => {
  if (status === "on-hold") {
    return "bg-blue-600 text-white hover:bg-blue-700"
  }

  if (status === "processing") {
    return "bg-green-600 text-white hover:bg-green-700"
  }

  if (status === "ready") {
    return "bg-purple-600 text-white hover:bg-purple-700"
  }

  return "bg-slate-800 text-white hover:bg-slate-900"
}

const OrderTabs = ({
  activeTab,
  setActiveTab,
  counts
}: OrderTabsProps) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false)

  const isMoreActive = isSecondaryStatus(activeTab)

  useEffect(() => {
    if (isMoreActive) {
      setIsMoreOpen(true)
    }
  }, [isMoreActive])

  return (
    <div className="relative mb-4">
      <div className="overflow-x-auto">
        <div className="flex min-w-full w-max items-center gap-2 pr-1">
          {primaryTabs.map((tab) => {
            const isActive = activeTab === tab.key

            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key)
                  setIsMoreOpen(false)
                }}
                className={`
                  min-h-11 shrink-0 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold leading-none transition-colors sm:px-5 sm:py-3
                  ${isActive
                    ? getPrimaryTabActiveClasses(tab.key)
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"}
                `}
              >
                {tab.label}
                {shouldShowTabCount(tab.key) && (
                  <span
                    className={`ml-1.5 text-xs sm:ml-2 ${
                      isActive ? "text-white/90" : "text-slate-500"
                    }`}
                  >
                    ({counts[tab.key] || 0})
                  </span>
                )}
              </button>
            )
          })}

          <button
            type="button"
            onClick={() => {
              if (isMoreActive) {
                setIsMoreOpen(true)
                return
              }

              setIsMoreOpen((prev) => !prev)
            }}
            className={`
              min-h-11 shrink-0 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold leading-none transition-colors sm:px-5 sm:py-3
              ${isMoreActive || isMoreOpen
                ? "bg-slate-800 text-white hover:bg-slate-900"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"}
            `}
          >
            Ещё
          </button>

          {isMoreOpen && secondaryTabs.map((tab) => {
            const isActive = activeTab === tab.key

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key)
                }}
                className={`
                  min-h-11 shrink-0 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold leading-none transition-colors sm:px-5 sm:py-3
                  ${isActive
                    ? "bg-slate-800 text-white hover:bg-slate-900"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"}
                `}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export { OrderTabs }