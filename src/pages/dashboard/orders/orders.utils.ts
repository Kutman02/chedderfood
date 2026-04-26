import type { OrderStatus } from "@/types"
import {
  DEFAULT_ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TABS,
  TAB_SKELETON_CHAR_WIDTH,
  TAB_SKELETON_MAX_WIDTH,
  TAB_SKELETON_MIN_WIDTH,
  TAB_SKELETON_PADDING,
} from "./orders.constants"
import type { OrdersDateFilter, OrdersDateMode } from "./orders.types"

export const parseOrderStatusFromQuery = (value: string | null): OrderStatus | null => {
  if (!value) return null

  const normalized = value.trim().toLowerCase() as OrderStatus

  return ORDER_STATUS_TABS.includes(normalized)
    ? normalized
    : null
}

export const normalizeOrderStatus = (value: unknown): OrderStatus => {
  const normalized = String(value || DEFAULT_ORDER_STATUS).trim().toLowerCase()

  if (normalized === "pending") return "on-hold"
  if (normalized === "canceled") return "cancelled"

  if (
    normalized === "on-hold" ||
    normalized === "processing" ||
    normalized === "ready" ||
    normalized === "completed" ||
    normalized === "cancelled"
  ) {
    return normalized
  }

  return DEFAULT_ORDER_STATUS
}

export const parseRouteOrderId = (value: string | undefined): number | null => {
  if (!value) return null

  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}

export const getTabSkeletonWidth = (status: OrderStatus) => {
  const label = ORDER_STATUS_LABELS[status] || ""
  const width = Math.min(
    TAB_SKELETON_MAX_WIDTH,
    Math.max(
      TAB_SKELETON_MIN_WIDTH,
      label.length * TAB_SKELETON_CHAR_WIDTH + TAB_SKELETON_PADDING
    )
  )

  return `${width}px`
}

export const supportsDateFilters = (status: OrderStatus) =>
  status === "completed" || status === "cancelled"

export const buildDateFilter = (
  isDateFiltersEnabled: boolean,
  dateMode: OrdersDateMode,
  selectedDate: string,
  dateFrom: string,
  dateTo: string
): OrdersDateFilter => {
  if (!isDateFiltersEnabled) {
    return { mode: "all" }
  }

  if (dateMode === "all") {
    return { mode: "all" }
  }

  if (dateMode === "today") {
    return { mode: "today" }
  }

  if (dateMode === "day") {
    return {
      mode: "day",
      date: selectedDate,
    }
  }

  return {
    mode: "range",
    date_from: dateFrom,
    date_to: dateTo,
  }
}
