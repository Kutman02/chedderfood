import { useState } from "react"
import { useAppDispatch } from "@/app/hooks"
import { setCredentials } from "@/app/slices/authSlice"
import { useNavigate } from "react-router-dom"
import { useLoginMutation } from "@/api"

export const useLogin = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [login, { isLoading }] = useLoginMutation()
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (username: string, password: string) => {
    setError(null)

    try {
      const result = await login({ username, password }).unwrap()

      dispatch(
        setCredentials({
          token: result.token,
          user: result.user,
        })
      )

      navigate("/dashboard")
    } catch (err) {
      console.error("❌ Login error:", err)
      setError("Неверный логин или пароль")
    }
  }

  return {
    login: handleLogin,
    isLoading,
    error,
  }
}