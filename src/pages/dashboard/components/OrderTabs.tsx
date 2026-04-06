import type { OrderStatus } from "@/types"

interface OrderTabsProps {
  activeTab: OrderStatus
  setActiveTab: (tab: OrderStatus) => void
  counts: Record<OrderStatus, number | string>
}

const tabs: Array<{ key: OrderStatus, label: string }> = [
  { key: "on-hold", label: "Новые" },
  { key: "processing", label: "Готовятся" },
  { key: "ready", label: "Готовые" },
  { key: "completed", label: "Завершён" },
  { key: "cancelled", label: "Отменённые" }
]

const OrderTabs = ({
  activeTab,
  setActiveTab,
  counts
}: OrderTabsProps) => {

  return (
    <div className="flex gap-2 mb-4 flex-wrap">

      {tabs.map(tab => {

        const isActive = activeTab === tab.key

        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition
              ${isActive
                ? "bg-orange-500 text-white"
                : "bg-slate-100 hover:bg-slate-200"}
            `}
          >

            {tab.label}

            <span className="ml-2 text-xs opacity-80">
              ({counts[tab.key] || 0})
            </span>

          </button>
        )

      })}

    </div>
  )
}

export { OrderTabs }