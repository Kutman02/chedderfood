export interface LoginDto {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  userName: string
}

export const authService = {
  async login({ username, password }: LoginDto): Promise<AuthResponse> {

    const basic = btoa(`${username}:${password}`)

    const res = await fetch(
      "https://your-wp-site.com/wp-json/wp/v2/users/me",
      {
        headers: {
          Authorization: `Basic ${basic}`
        }
      }
    )

    if (!res.ok) {
      throw new Error("Invalid credentials")
    }

    const user = await res.json()

    return {
      token: basic, // ⚠️ временно
      userName: user.name || "User"
    }
  }
}