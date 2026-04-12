/**
 * Common API Response Types
 */

export interface ErrorResponse {
  code: string
  message: string
  data?: {
    status?: number
    errors?: Record<string, any>
    restaurant?: {
      is_open: boolean
      checkout_allowed: boolean
      mode: "24_7" | "daily" | "weekly"
      timezone: string
      schedule_text: string
      opens_at?: string | null
      opens_in_minutes?: number | null
      closes_at?: string | null
      closes_in_minutes?: number | null
    }
  }
}

export interface SuccessResponse<T = any> {
  success: boolean
  data?: T
  message?: string
}
