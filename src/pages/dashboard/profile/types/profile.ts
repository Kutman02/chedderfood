export interface Profile {
  id: number
  name: string
  first_name?: string
  last_name?: string
  avatar_url?: string | null
  email?: string
  role?: string
}
