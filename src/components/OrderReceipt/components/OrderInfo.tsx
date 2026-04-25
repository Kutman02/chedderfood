import type { FC } from "react"
import type { Order } from "@/types"

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

const resolveCreatedTimestamp = (order: Order): number | null => {
  const firstHistoryDate = Array.isArray(order.status_history)
    ? order.status_history
        .map((entry) => entry?.changed_at)
        .find((value): value is string => typeof value === "string" && value.trim().length > 0)
    : undefined

  const candidates: unknown[] = [
    order.date_created_unix,
    order.date_created,
    order.changed_at,
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

interface ShippingInfo {
  method: string
  address: string
  cost: number
  status: string
}

interface OrderInfoProps {
  order: Order
  formatDate: (date: string) => string
  shippingInfo: ShippingInfo
}

export const OrderInfo: FC<OrderInfoProps> = ({
  order,
  formatDate,
  shippingInfo,
}) => {

  const isPickup = order.order_type === "pickup"
  const displayAddress = isPickup
    ? order.pickup_address || order.address || "Не указан"
    : order.address || "Не указан"

  const createdTimestamp = resolveCreatedTimestamp(order)

  const createdTime = createdTimestamp === null
    ? null
    : timeFormatter.format(new Date(createdTimestamp))

  const elapsedFromBackend =
    typeof order.date_created_human === "string" && order.date_created_human.trim()
      ? order.date_created_human.trim()
      : null

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-6">

      <div className="mb-4">

        <p className="text-sm text-slate-500">
          Заказ
        </p>

        <p className="text-2xl font-black text-orange-600">
          #{order.id}
        </p>

        {(createdTime || elapsedFromBackend) && (
          <p className="text-sm font-semibold text-slate-700">
            {createdTime || "--:--"}
            {elapsedFromBackend ? ` • ${elapsedFromBackend}` : ""}
          </p>
        )}

        <p className="text-sm text-slate-600">
          {order.date_created
            ? formatDate(order.date_created)
            : "-"}
        </p>

      </div>

      <div className="space-y-4 text-sm">

        {/* 🔥 У тебя нет payment_method → не выдумываем */}
        <div>
          <p className="text-slate-500">
            Оплата
          </p>

          <p className="font-semibold text-slate-800">
            Наличные / При получении
          </p>
        </div>

        <div>
          <p className="text-slate-500">
            Способ получения
          </p>

          <p className="font-semibold text-orange-600">
            {shippingInfo.method}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            {isPickup
              ? "Стоимость доставки не применяется"
              : shippingInfo.cost > 0
                ? `Доставка: ${shippingInfo.cost.toFixed(0)} сом`
                : "Доставка: бесплатно"}
          </p>
        </div>

        <div>
          <p className="text-slate-500">
            {isPickup ? "Адрес ресторана (самовывоз)" : "Адрес"}
          </p>

          <p className="font-semibold text-slate-800">
            {displayAddress}
          </p>
        </div>

      </div>

    </div>
  )
}