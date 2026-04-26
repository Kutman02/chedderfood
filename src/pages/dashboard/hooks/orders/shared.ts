import type { OrderStatus } from "@/types"
import type { OrdersDateFilter } from "./types"

export const ORDERS_LIST_FIELDS =
  "id,status,reason,changed_at,changed_by_user_id,total,shipping_total,shipping_lines,customer_name,phone,address,apartment_office,floor,order_type,customer_note,needs_cutlery_and_napkins,pickup_address,pickup_map_url,pickup_2gis_url,line_items,status_history,meta_data,date_created,date_created_unix,date_created_human"

export const ORDERS_COUNT_FIELDS = "id,status"

export const COUNT_QUERY_OPTIONS = {
  pollingInterval: 1500,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
} as const

export const supportsDateFiltersByStatus = (status: string) =>
  status === "completed" || status === "cancelled"

export const normalizeOrderStatus = (value: unknown): OrderStatus => {
  const normalized = String(value || "on-hold").trim().toLowerCase()

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

  return "on-hold"
}

export const buildDateParams = (
  dateFilter: OrdersDateFilter,
  allowDateFilters: boolean
) => {
  if (!allowDateFilters) {
    return { scope: "all" as const }
  }

  if (dateFilter.mode === "today") {
    return { scope: "today" as const }
  }

  if (dateFilter.mode === "all") {
    return { scope: "all" as const }
  }

  if (dateFilter.mode === "day") {
    return dateFilter.date ? { date: dateFilter.date } : {}
  }

  return {
    ...(dateFilter.date_from ? { date_from: dateFilter.date_from } : {}),
    ...(dateFilter.date_to ? { date_to: dateFilter.date_to } : {}),
  }
}
