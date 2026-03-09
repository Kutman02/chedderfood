export interface AuthResult {
  success?: boolean
  user?: {
    id: number
    email: string
    name: string
  }
  message?: string
  error?: string
  data?: Record<string, unknown>
}