import { useEffect, useState } from "react"
import { useAppDispatch } from "@/app/hooks"
import { setCredentials, logout } from "@/app/slices/authSlice"
import { useGetMeQuery } from "@/api"
import { authStorage } from "@/shared/lib/storage"

export const useAuthInit = () => {
  const dispatch = useAppDispatch()
  const [isAuthChecked, setIsAuthChecked] = useState(false)

  const token = authStorage.getToken()
  const { data: user, error } = useGetMeQuery(
    undefined,
    { skip: !token }
  )

  useEffect(() => {
    if (token && user) {
      /* ✅ токен есть и пользователь загружен */
      dispatch(
        setCredentials({
          token,
          user,
        })
      )
      setIsAuthChecked(true)
    } else if (!token) {
      /* ✅ нет токена — просто пропускаем */
      setIsAuthChecked(true)
    } else if (error) {
      /* ❌ ошибка при загрузке пользователя — logout */
      console.warn("Auth check failed → logout")
      dispatch(logout())
      setIsAuthChecked(true)
    }
  }, [token, user, error, dispatch])

  return { isAuthChecked }
}