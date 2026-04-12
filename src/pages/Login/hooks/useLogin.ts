import { useState } from "react"
import { useAppDispatch } from "@/app/hooks"
import { setCredentials } from "@/app/slices/authSlice"
import { useNavigate } from "react-router-dom"
import { useLoginMutation } from "@/api"
import { useToastStore } from "@/stores/toastStore"

/* =========================
   LOGIN HOOK
   Обработка аутентификации пользователя
   Сохраняет token и user в Redux + localStorage
========================= */

export const useLogin = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const addToast = useToastStore((state) => state.addToast)

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

      addToast(
        `Добро пожаловать, ${result.user.name}!`,
        "success",
        3000
      )

      navigate("/dashboard")
    } catch (err) {
      console.error("❌ Login error:", err)
      const errorMsg = "Неверный логин или пароль"
      setError(errorMsg)
      addToast(errorMsg, "error", 4000)
    }
  }

  return {
    login: handleLogin,
    isLoading,
    error,
  }
}