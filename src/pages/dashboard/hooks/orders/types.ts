import type { OrderStatus } from "@/types"

export type OrdersDateFilter = {
  mode: "today" | "all" | "day" | "range"
  date?: string
  date_from?: string
  date_to?: string
}

export type OrdersCountsRaw = {
  "on-hold": number
  processing: number
  ready: number
  completed: number
  cancelled: number
}

export type OrdersFilterCounts = {
  today: number
  all: number
  day: number
  range: number
}

export type OrdersCounts = Record<OrderStatus, number>
