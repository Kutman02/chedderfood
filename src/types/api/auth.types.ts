export type UserRole = "administrator" | "restaurant_admin"

export interface User {
  id: number
  name: string
  first_name?: string
  last_name?: string
  email?: string
  avatar_url?: string | null
  capabilities?: string[]
  role?: UserRole
}

export interface AuthResponse {
  success: boolean
  token: string
  user: User
  expires_in?: number
}

export interface ProfileResponse {
  success: boolean
  user: User
  message?: string
}

export interface ProfileUpdateRequest {
  first_name?: string
  last_name?: string
  display_name?: string
  avatar_url?: string | null
}

export interface LoginRequest {
  username: string
  password: string
}
