export type RestaurantMode = "24_7" | "daily" | "weekly"

export interface RestaurantHoursStatus {
  is_open: boolean
  checkout_allowed: boolean
  mode: RestaurantMode
  timezone: string
  schedule_text: string
  now_local: string
  opens_at?: string | null
  closes_at?: string | null
  opens_in_minutes?: number | null
  closes_in_minutes?: number | null
  message: string
}

export interface RestaurantHoursResponse {
  success: boolean
  data: RestaurantHoursStatus
}
