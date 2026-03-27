import { useState } from "react"
import { useAppDispatch } from "@/app/hooks"
import { setCredentials } from "@/app/slices/authSlice"
import { useNavigate } from "react-router-dom"
import { authService } from "@/services/authService"

export const useLogin = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (username: string, password: string) => {
    if (isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await authService.login({ username, password })

      dispatch(
        setCredentials({
          token: data.token,
          user: data.user,
        })
      )

      navigate("/dashboard")
    } catch (err) {
      console.error("❌ Login error:", err)
      setError("Неверный логин или пароль")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    login,
    isLoading,
    error,
  }
}