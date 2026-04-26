import { FILTER_SKELETON_WIDTH_CLASSES } from "../orders.constants"
import type { OrdersDateMode } from "../orders.types"

type FilterCounts = {
  today: number
  all: number
  day: number
  range: number
}

type OrdersDateFiltersProps = {
  showHeaderSkeleton: boolean
  querySupportsDateFilters: boolean
  isDetailsOpen: boolean
  backendTimezone: string
  backendTime: string
  dateMode: OrdersDateMode
  filterCounts: FilterCounts
  selectedDate: string
  dateFrom: string
  dateTo: string
  onDateModeChange: (mode: OrdersDateMode) => void
  onSelectedDateChange: (value: string) => void
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
}

const DateModeButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
        isActive
          ? "bg-orange-500 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {label}
    </button>
  )
}

export const OrdersDateFilters = ({
  showHeaderSkeleton,
  querySupportsDateFilters,
  isDetailsOpen,
  backendTimezone,
  backendTime,
  dateMode,
  filterCounts,
  selectedDate,
  dateFrom,
  dateTo,
  onDateModeChange,
  onSelectedDateChange,
  onDateFromChange,
  onDateToChange,
}: OrdersDateFiltersProps) => {
  if (showHeaderSkeleton) {
    return (
      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 h-3 w-64 animate-pulse rounded bg-slate-100" />
        <div className="flex flex-wrap items-center gap-2">
          {FILTER_SKELETON_WIDTH_CLASSES.map((widthClass, index) => (
            <div
              key={`filters-skeleton-${index}`}
              className={`h-9 animate-pulse rounded-lg bg-slate-100 ${widthClass}`}
            />
          ))}
        </div>
      </div>
    )
  }

  if (!querySupportsDateFilters || isDetailsOpen) {
    return null
  }

  return (
    <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
      <p className="mb-3 text-xs font-medium text-slate-500">
        Часовой пояс сервера: <span className="font-semibold text-slate-700">{backendTimezone}</span>
        {" · "}
        Время: <span className="font-semibold text-slate-700">{backendTime}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <DateModeButton
          label={`Сегодня (${filterCounts.today})`}
          isActive={dateMode === "today"}
          onClick={() => onDateModeChange("today")}
        />

        <DateModeButton
          label={`Посмотреть все (${filterCounts.all})`}
          isActive={dateMode === "all"}
          onClick={() => onDateModeChange("all")}
        />

        <DateModeButton
          label={`По дате (${filterCounts.day})`}
          isActive={dateMode === "day"}
          onClick={() => onDateModeChange("day")}
        />

        <DateModeButton
          label={`Диапазон (${filterCounts.range})`}
          isActive={dateMode === "range"}
          onClick={() => onDateModeChange("range")}
        />
      </div>

      {dateMode === "day" && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <label className="text-slate-600">Дата:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onSelectedDateChange(e.target.value)}
            aria-label="Выберите дату"
            title="Выберите дату"
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
      )}

      {dateMode === "range" && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <label className="text-slate-600">С:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            aria-label="Начальная дата диапазона"
            title="Начальная дата диапазона"
            className="rounded-lg border border-slate-300 px-3 py-2"
          />

          <label className="text-slate-600">По:</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            aria-label="Конечная дата диапазона"
            title="Конечная дата диапазона"
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
      )}
    </div>
  )
}
