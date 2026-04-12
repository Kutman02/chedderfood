/**
 * Common API Response Types
 */

export interface ErrorResponse {
  code: string
  message: string
  data?: {
    status?: number
    errors?: Record<string, any>
  }
}

export interface SuccessResponse<T = any> {
  success: boolean
  data?: T
  message?: string
}
