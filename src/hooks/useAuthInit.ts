// hooks/useAuthInit.ts

import { useEffect, useState } from "react"
import { useAppDispatch } from "@/app/hooks"
import { setCredentials, logout } from "@/app/slices/authSlice"
import { authService } from "@/services/authService"

export const useAuthInit = () => {
  const dispatch = useAppDispatch()
  const [isAuthChecked, setIsAuthChecked] = useState(false)

  useEffect(() => {
    let isMounted = true // 🔥 защита от setState после unmount

    const initAuth = async () => {
      const token = localStorage.getItem("token")

      // ❌ нет токена — просто пропускаем
      if (!token) {
        if (isMounted) setIsAuthChecked(true)
        return
      }

      try {
        // 🔐 проверяем токен через backend
        const user = await authService.me()

        if (!isMounted) return

        dispatch(
          setCredentials({
            token,
            user,
          })
        )
      } catch (err) {
        console.warn("Auth check failed → logout")

        if (!isMounted) return

        dispatch(logout())
      } finally {
        if (isMounted) setIsAuthChecked(true)
      }
    }

    initAuth()

    return () => {
      isMounted = false
    }
  }, [dispatch])

  return { isAuthChecked }
}