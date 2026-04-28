import { useEffect, useRef, useState } from "react"

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

const OrderTabs = ({
  activeTab,
  setActiveTab,
  counts
}: OrderTabsProps) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const moreMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isMoreOpen) {
      return
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setIsMoreOpen(false)
      }
    }

    window.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMoreOpen])

  const isMoreActive = isSecondaryStatus(activeTab)

  return (
    <div ref={moreMenuRef} className="relative mb-4">
      <div className="overflow-x-auto">
        <div className="flex min-w-full w-max items-center gap-2 pr-1">
          <div className="sticky left-0 z-20 flex shrink-0 items-center gap-2 bg-white pr-2">
          {primaryTabs.map(tab => {

            const isActive = activeTab === tab.key

            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key)
                  setIsMoreOpen(false)
                }}
                className={`
                  shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm
                  ${isActive
                    ? "bg-orange-500 text-white"
                    : "bg-slate-100 hover:bg-slate-200"}
                `}
              >
                {tab.label}
                {shouldShowTabCount(tab.key) && (
                  <span className="ml-1.5 text-[11px] opacity-85 sm:ml-2 sm:text-xs">
                    ({counts[tab.key] || 0})
                  </span>
                )}
              </button>
            )

          })}
        </div>

          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsMoreOpen((prev) => !prev)}
              className={`
                shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm
                ${isMoreActive
                  ? "bg-orange-500 text-white"
                  : "bg-slate-100 hover:bg-slate-200"}
              `}
            >
              Ещё
            </button>
          </div>
        </div>
      </div>

      {isMoreOpen && (
        <div className="mt-2 flex justify-end">
          <div className="w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
            {secondaryTabs.map((tab) => {
              const isActive = activeTab === tab.key

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.key)
                    setIsMoreOpen(false)
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export { OrderTabs }