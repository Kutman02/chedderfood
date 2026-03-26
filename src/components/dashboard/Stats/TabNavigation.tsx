import type { TabConfig } from "./types"

interface Props {
  tab: TabConfig
  active: boolean
  onClick: () => void
  ordersCount: number
}

export const TabButton = ({
  tab,
  active,
  onClick,
  ordersCount
}: Props) => {

  const Icon = tab.icon

  return (

    <button
      onClick={onClick}
      className={`relative flex items-center gap-3 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-300 min-w-35
      ${
        active
          ? `bg-linear-to-r ${tab.color} text-white shadow-md`
          : `bg-white text-slate-600 border-2 ${tab.borderColor}`
      }`}
    >

      <Icon className="text-lg" />

      <div className="flex flex-col items-start">

        <span>{tab.label}</span>

        {active && ordersCount > 0 && (
          <span className="text-[10px] font-bold text-white/90">
            {ordersCount} заказов
          </span>
        )}

      </div>

    </button>

  )

}