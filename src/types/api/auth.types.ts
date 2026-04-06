export interface User {
  id: number
  name: string
  email?: string
  role?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginRequest {
  username: string
  password: string
}