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

      <div className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 px-3 py-3 sm:min-w-[170px] sm:bg-transparent sm:px-0 sm:py-0">
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