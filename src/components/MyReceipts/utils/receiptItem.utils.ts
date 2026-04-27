import type { Order } from "@/types"

const DELETABLE_RECEIPT_STATUSES = new Set([
  "completed",
  "cancelled",
  "canceled",
])

const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
})

export const parseDateTimestamp = (value: unknown): number | null => {
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

export const getOrderAccent = (status: string) => {
  switch (status) {
    case "on-hold":
      return {
        title: "text-yellow-700 animate-pulse",
        badge: "ring-2 ring-yellow-300 animate-pulse",
      }

    case "processing":
      return {
        title: "text-blue-700 animate-pulse",
        badge: "ring-2 ring-blue-300 animate-pulse",
      }

    case "ready":
      return {
        title: "text-green-700",
        badge: "ring-2 ring-green-300",
      }

    case "completed":
      return {
        title: "text-yellow-900",
        badge: "ring-2 ring-yellow-900/30",
      }

    case "cancelled":
      return {
        title: "text-red-700",
        badge: "ring-2 ring-red-300",
      }

    default:
      return {
        title: "text-slate-800",
        badge: "",
      }
  }
}

export const canDeleteReceipt = (receiptId: unknown, statusValue: string) => {
  return (
    Number.isFinite(Number(receiptId)) &&
    Number(receiptId) > 0 &&
    DELETABLE_RECEIPT_STATUSES.has(statusValue)
  )
}

export const getReceiptItemsCount = (receipt: Order) => {
  const normalizedItems = Array.isArray(receipt.items)
    ? receipt.items
    : Array.isArray(receipt.line_items)
      ? receipt.line_items
      : []

  return normalizedItems.length
}

export const getReceiptCreatedMetaText = (receipt: Order) => {
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

  return createdTime || elapsedFromBackend
    ? `${createdTime || "--:--"}${elapsedFromBackend ? ` • ${elapsedFromBackend}` : ""}`
    : null
}
