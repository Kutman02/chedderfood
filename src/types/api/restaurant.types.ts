export type RestaurantMode = "24_7" | "daily" | "weekly"

export interface RestaurantHoursStatus {
  is_open: boolean
  checkout_allowed: boolean
  mode: RestaurantMode
  timezone: string
  schedule_text: string
  pickup?: {
    address: string
    map_url: string
  }
  now_local: string
  opens_at?: string | null
  closes_at?: string | null
  opens_in_minutes?: number | null
  closes_in_minutes?: number | null
  pickup_address?: string | null
  pickup_map_url?: string | null
  pickup_2gis_url?: string | null
  map_2gis?: string | null
  map2gis?: string | null
  address?: string | null
  restaurant_address?: string | null
  message: string
}

export interface RestaurantHoursResponse {
  success: boolean
  data: RestaurantHoursStatus
}
