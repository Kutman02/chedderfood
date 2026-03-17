import { useState } from "react"
import { useLazyGetMeQuery } from "@/api"
import { useAppDispatch } from "@/app/hooks"
import { setCredentials } from "@/app/slices/authSlice"
import { useNavigate } from "react-router-dom"

export const useLogin = () => {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [getMe] = useLazyGetMeQuery()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async () => {

    setIsLoading(true)
    setError(null)

    try {

      // ✅ проверка через WP
      const user = await getMe().unwrap()

      dispatch(
        setCredentials({
          token: "app_password_authenticated",
          userName: user.name || "User"
        })
      )

      console.log("👤 Login successful:", user.name)

      navigate("/dashboard")

    } catch (err) {

      console.error("❌ Login failed:", err)

      setError("Ошибка авторизации. Проверь Application Password.")

    } finally {

      setIsLoading(false)

    }

  }

  return {
    login,
    isLoading,
    error
  }

}