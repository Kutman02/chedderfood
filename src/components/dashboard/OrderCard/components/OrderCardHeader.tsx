import { useMemo } from "react"
import { FaPhone } from "react-icons/fa"
import type { OrderCardHeaderProps } from "../types/orderCard.types"

const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
})

const parseDateTimestamp = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value > 1e12 ? value : value * 1000
  }

  if (typeof value !== "string") {
    return null
  }

  const raw = value.trim()
  if (!raw) return null

  if (/^\d+$/.test(raw)) {
    const numeric = Number(raw)
    if (Number.isFinite(numeric)) {
      return numeric > 1e12 ? numeric : numeric * 1000
    }
  }

  const directParsed = Date.parse(raw)
  if (!Number.isNaN(directParsed)) {
    return directParsed
  }

  const normalized = raw.replace(" ", "T").replace(/([+-]\d{2})(\d{2})$/, "$1:$2")
  const normalizedParsed = Date.parse(normalized)

  if (!Number.isNaN(normalizedParsed)) {
    return normalizedParsed
  }

  return null
}

const resolveCreatedTimestamp = (order: any): number | null => {
  const firstHistoryDate = Array.isArray(order?.status_history)
    ? order.status_history
        .map((entry: any) => entry?.changed_at)
        .find((value: unknown) => typeof value === "string" && value.trim().length > 0)
    : null

  const candidates: unknown[] = [
    order?.date_created_unix,
    order?.date_created,
    order?.date_created_gmt,
    order?.created_at,
    order?.changed_at,
    firstHistoryDate,
  ]

  for (const candidate of candidates) {
    const timestamp = parseDateTimestamp(candidate)
    if (timestamp !== null) {
      return timestamp
    }
  }

  return null
}

export const OrderCardHeader = ({
  order,
  activeTabData
}: OrderCardHeaderProps) => {
  const o = order as any // 🔥 FIX

  const customerName =
    o?.customer_name || "Клиент"

  const phone =
    o?.phone || ""

  const orderNumber =
    o?.number || o?.id || "—"

  const total =
    o?.total || "0"

  const createdTimestamp = useMemo(
    () => resolveCreatedTimestamp(o),
    [o?.date_created_unix, o?.date_created, o?.date_created_gmt, o?.created_at, o?.changed_at, o?.date_created_human, o?.status_history]
  )
  const isCompletedOrder = o?.status === "completed" || o?.status === "cancelled"

  const createdTime = createdTimestamp === null
    ? "--:--"
    : timeFormatter.format(new Date(createdTimestamp))

  const elapsedFromBackend =
    typeof o?.date_created_human === "string" && o.date_created_human.trim()
      ? o.date_created_human.trim()
      : null

  const elapsed = isCompletedOrder
    ? null
    : elapsedFromBackend

  return (
    <div className="mb-4 space-y-4 sm:flex sm:items-start sm:justify-between sm:space-y-0">

      <div className="flex min-w-0 gap-3">

        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-base ${activeTabData?.color}
          flex items-center justify-center text-white font-black`}
        >
          # {orderNumber}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-xl font-black leading-none text-slate-950 sm:text-lg">
            {customerName}
          </h3>

          {phone ? (
            <a
              href={`tel:${phone}`}
              className="mt-2 flex items-center gap-2 break-all text-lg font-bold text-orange-600 sm:mt-1 sm:text-base"
            >
              <FaPhone size={12} />
              {phone}
            </a>
          ) : (
            <p className="mt-2 text-sm text-slate-400 sm:mt-1">
              Нет номера
            </p>
          )}
        </div>

      </div>

      <div className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 px-3 py-3 sm:min-w-42.5 sm:bg-transparent sm:px-0 sm:py-0">
        <div className="text-left sm:text-right">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Заказ пришёл
          </p>
          <p className="mt-1 text-base font-black text-slate-700 sm:text-sm">
            {createdTime}
            {elapsed ? ` • ${elapsed}` : ""}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Сумма
          </p>
          <p className="mt-1 text-xl font-black text-green-600 sm:text-lg">
            {total} сом
          </p>
        </div>
      </div>

    </div>
  )
}