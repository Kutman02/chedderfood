export const TERMINAL_RECEIPT_STATUSES = new Set([
  "completed",
  "cancelled",
  "canceled",
  "failed",
  "refunded",
  "trash",
])

export const DELETABLE_RECEIPT_STATUSES = new Set([
  "completed",
  "cancelled",
])

export const STATUS_SYNC_INTERVAL_MS = 15000

export const STATUS_SYNC_UNAVAILABLE_TOAST =
  "Автообновление статуса заказа пока недоступно: не настроен публичный endpoint"

export const MISSING_PUBLIC_KEY_TOAST =
  "Для некоторых старых чеков автообновление статуса недоступно: отсутствует public_key"
