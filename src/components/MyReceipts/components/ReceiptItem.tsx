import { FaChevronDown } from "react-icons/fa"

import type { Order } from "@/types"
import type { Product } from "@/types"

import { OrderDetailsContent } from "@/components/dashboard/OrderDetailsModal/components"

import { getOrderStatus } from "../utils/getOrderStatus"
import { OrderProgress } from "./OrderProgress"

interface ReceiptItemProps {
  receipt: Order
  products: Product[]
  isDetailsOpen: boolean
  isDeleteConfirmOpen: boolean
  onDelete: (id: number, status: string) => void
  onConfirmDelete: (id: number) => void
  onCancelDelete: () => void
  onView: (receipt: Order) => void
}

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

  const parsed = Date.parse(raw)
  if (!Number.isNaN(parsed)) {
    return parsed
  }

  const normalized = raw.replace(" ", "T").replace(/([+-]\d{2})(\d{2})$/, "$1:$2")
  const normalizedParsed = Date.parse(normalized)

  if (!Number.isNaN(normalizedParsed)) {
    return normalizedParsed
  }

  return null
}

const getOrderBorder = (status: string) => {
  switch (status) {
    case "on-hold":
      return "border-2 border-yellow-400 animate-pulse"

    case "processing":
      return "border-2 border-blue-400 animate-pulse"

    case "ready":
      return "border-2 border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.4)]"

    case "completed":
      return "border-2 border-yellow-900"

    case "cancelled":
      return "border-2 border-red-400"

    default:
      return "border border-slate-200"
  }
}

export const ReceiptItem = ({
  receipt,
  products,
  isDetailsOpen,
  isDeleteConfirmOpen,
  onDelete,
  onConfirmDelete,
  onCancelDelete,
  onView
}: ReceiptItemProps) => {

  const statusValue = String(receipt.status || "on-hold").trim().toLowerCase()

  const status = getOrderStatus(statusValue)

  const canDelete = [
    "completed",
    "cancelled",
    "canceled",
    "failed",
    "refunded",
    "trash",
  ].includes(statusValue)

  const normalizedItems = Array.isArray(receipt.items)
    ? receipt.items
    : Array.isArray(receipt.line_items)
      ? receipt.line_items
      : []

  const createdTimestamp =
    parseDateTimestamp(receipt.date_created_unix) ??
    parseDateTimestamp(receipt.date_created) ??
    parseDateTimestamp(receipt.changed_at)

  const createdTime = createdTimestamp === null
    ? null
    : timeFormatter.format(new Date(createdTimestamp))

  const elapsedFromBackend =
    typeof receipt.date_created_human === "string" && receipt.date_created_human.trim()
      ? receipt.date_created_human.trim()
      : null

  const createdMetaText =
    createdTime || elapsedFromBackend
      ? `${createdTime || "--:--"}${elapsedFromBackend ? ` • ${elapsedFromBackend}` : ""}`
      : null

  const itemsCount = normalizedItems.length

  return (
    <div
      className={`
        bg-white
        rounded-2xl
        p-5
        shadow-sm
        hover:shadow-md
        hover:-translate-y-1
        transition
        flex
        flex-col
        justify-between
        gap-4
        ${getOrderBorder(statusValue)}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg text-slate-800">
            Заказ: #{receipt.number ?? receipt.id}
          </h3>

          {createdMetaText && (
            <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
              {createdMetaText}
            </p>
          )}

        </div>

        <span
          className={`
            text-xs
            font-medium
            px-3
            py-1
            rounded-full
            ${status.color}
          `}
        >
          {status.label}
        </span>
      </div>

      <OrderProgress status={statusValue} />

      <div className="text-sm text-slate-600 space-y-1">

        {receipt.total && (
          <p>
            Сумма:{" "}
            <span className="font-semibold text-orange-500">
              {receipt.total} сом
            </span>
          </p>
        )}

        {itemsCount > 0 && (
          <p>
            Товаров:{" "}
            <span className="font-medium">
              {itemsCount}
            </span>
          </p>
        )}

      </div>

      <button
        type="button"
        onClick={() => onView(receipt)}
        className="group flex min-h-12 w-full touch-manipulation select-none items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-xs transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 active:translate-y-0 active:scale-[0.99]"
      >
        <span>{isDetailsOpen ? "Скрыть" : "Посмотреть"}</span>
        <FaChevronDown
          size={14}
          className={`transition-all duration-300 ease-out ${isDetailsOpen ? "rotate-180" : "rotate-0"} group-hover:text-orange-600`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isDetailsOpen ? "mb-0 grid-rows-[1fr] opacity-100" : "mb-0 grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="mx-0 border-t border-slate-200 bg-linear-to-b from-slate-50 to-stone-100 px-3 py-4 text-slate-900 sm:rounded-2xl sm:border sm:px-4 sm:py-4">
            <OrderDetailsContent
              order={receipt}
              products={products}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2">

        {canDelete ? (
          <div className="w-full space-y-3">
            <button
              type="button"
              onClick={() => onDelete(receipt.id, statusValue)}
              className="
                w-full
                border border-slate-200
                text-sm
                py-2
                rounded-lg
                text-slate-600
                hover:bg-red-50
                hover:text-red-600
                transition
              "
            >
              Удалить
            </button>

            <div
              className={`grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isDeleteConfirmOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <div className="rounded-2xl border border-red-100 bg-red-50/80 px-4 py-4 text-slate-900">
                  <p className="text-sm font-semibold text-slate-800">
                    Вы действительно хотите удалить заказ #{receipt.number ?? receipt.id}?
                  </p>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={onCancelDelete}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      Нет
                    </button>

                    <button
                      type="button"
                      onClick={() => onConfirmDelete(receipt.id)}
                      className="flex-1 rounded-xl border border-red-200 bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                    >
                      Да
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled
            className="
              w-full
              border border-slate-200
              text-sm
              py-2
              rounded-lg
              text-slate-400
              bg-slate-50
              cursor-not-allowed
            "
            title="Удаление доступно только для завершенных или отмененных заказов"
          >
            Удаление недоступно
          </button>
        )}

      </div>
    </div>
  )
}