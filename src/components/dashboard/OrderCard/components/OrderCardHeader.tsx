import { useEffect, useMemo, useState } from "react"
import { FaPhone } from "react-icons/fa"
import type { OrderCardHeaderProps } from "../types/orderCard.types"

const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
})

const formatElapsed = (dateCreated: string, now: number) => {
  const createdAt = new Date(dateCreated).getTime()

  if (Number.isNaN(createdAt)) {
    return null
  }

  const diffMinutes = Math.max(0, Math.floor((now - createdAt) / 60000))

  if (diffMinutes < 60) {
    return `${diffMinutes} мин`
  }

  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60

  if (minutes === 0) {
    return `${hours} ч`
  }

  return `${hours} ч ${minutes} мин`
}

export const OrderCardHeader = ({
  order,
  activeTabData
}: OrderCardHeaderProps) => {
  const [now, setNow] = useState(() => Date.now())

  const o = order as any // 🔥 FIX

  const customerName =
    o?.customer_name || "Клиент"

  const phone =
    o?.phone || ""

  const orderNumber =
    o?.number || o?.id || "—"

  const total =
    o?.total || "0"

  const createdAt = useMemo(() => new Date(o?.date_created), [o?.date_created])
  const isCompletedOrder = o?.status === "completed" || o?.status === "cancelled"

  useEffect(() => {
    if (isCompletedOrder) {
      return
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now())
    }, 60000)

    return () => window.clearInterval(intervalId)
  }, [isCompletedOrder])

  const createdTime = Number.isNaN(createdAt.getTime())
    ? "--:--"
    : timeFormatter.format(createdAt)

  const elapsed = isCompletedOrder
    ? null
    : formatElapsed(o?.date_created, now)

  return (
    <div className="flex justify-between items-start mb-4">

      <div className="flex gap-3">

        <div
          className={`w-14 h-14 rounded-xl bg-linear-to-br ${activeTabData?.color}
          flex items-center justify-center text-white font-black`}
        >
          # {orderNumber}
        </div>

        <div>
          <h3 className="text-lg font-black">
            {customerName}
          </h3>

          {phone ? (
            <a
              href={`tel:${phone}`}
              className="text-orange-600 font-bold flex items-center gap-2"
            >
              <FaPhone size={12} />
              {phone}
            </a>
          ) : (
            <p className="text-sm text-slate-400">
              Нет номера
            </p>
          )}
        </div>

      </div>

      <div className="text-right">
        <p className="text-xs font-bold text-slate-400 uppercase">
          Заказ пришёл
        </p>
        <p className="text-sm font-black text-slate-700">
          {createdTime}
          {elapsed ? ` • ${elapsed}` : ""}
        </p>
        <p className="text-xs font-bold text-slate-400 uppercase">
          Сумма
        </p>
        <p className="text-lg font-black text-green-600">
          {total} сом
        </p>
      </div>

    </div>
  )
}