import type { OrderStatus } from "@/types"

export const ORDER_STATUS_TABS: OrderStatus[] = [
  "on-hold",
  "processing",
  "ready",
  "completed",
  "cancelled",
]

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  "on-hold": "Новые",
  processing: "Готовятся",
  ready: "Готовые",
  completed: "Завершён",
  cancelled: "Отменённые",
}

export const ORDER_TAB_SKELETON_WIDTH_CLASSES: Record<OrderStatus, string> = {
  "on-hold": "w-24",
  processing: "w-36",
  ready: "w-28",
  completed: "w-32",
  cancelled: "w-36",
}

export const FILTER_SKELETON_WIDTHS = [96, 136, 112, 120]
export const FILTER_SKELETON_WIDTH_CLASSES = ["w-24", "w-36", "w-28", "w-32"]

export const TAB_SKELETON_MIN_WIDTH = 80
export const TAB_SKELETON_MAX_WIDTH = 180
export const TAB_SKELETON_CHAR_WIDTH = 8
export const TAB_SKELETON_PADDING = 32

export const ORDER_DETAILS_FIELDS =
  "id,status,reason,changed_at,changed_by_user_id,total,shipping_total,shipping_lines,customer_name,phone,address,apartment_office,floor,order_type,customer_note,needs_cutlery_and_napkins,pickup_address,pickup_map_url,pickup_2gis_url,line_items,status_history,meta_data,date_created,date_created_unix,date_created_human"

export const DEFAULT_ORDER_STATUS: OrderStatus = "on-hold"

export const ON_HOLD_COUNT_SESSION_KEY = "orders_on_hold_count"
