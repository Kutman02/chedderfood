import { useState } from "react"
import { useLazyGetMeQuery } from "@/api"

import type { AuthResult } from "../types"

const LOG = {
  info: "🔍",
  success: "✅",
  error: "❌",
  warn: "⚠️",
}

export const useAuthTest = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [result, setResult] = useState<AuthResult | null>(null)
  const [loading, setLoading] = useState(false)

  const [getMe] = useLazyGetMeQuery()

  // =========================
  // TEST LOGIN (через backend)
  // =========================
  const testLogin = async () => {

    setLoading(true)
    setResult(null)

    try {

      console.log(`${LOG.info} Проверка логина через API`)

      const user = await getMe().unwrap()

      setResult({
        success: true,
        message: "Авторизация успешна",
        data: user
      })

    } catch (error) {

      console.error(`${LOG.error} Ошибка авторизации`, error)

      setResult({
        success: false,
        error: "Ошибка авторизации"
      })

    } finally {
      setLoading(false)
    }
  }

  // =========================
  // TEST CURRENT USER
  // =========================
  const testGetCurrentUser = async () => {

    try {

      console.log(`${LOG.info} Получение текущего пользователя`)

      const user = await getMe().unwrap()

      setResult({
        success: true,
        message: "Пользователь получен",
        data: user
      })

    } catch (error) {

      console.error(`${LOG.error} Не удалось получить пользователя`, error)

      setResult({
        success: false,
        message: "Не удалось получить пользователя"
      })

    }

  }

  return {
    username,
    password,
    setUsername,
    setPassword,
    result,
    loading,

    testLogin,
    testGetCurrentUser,
    testAppPassword: testGetCurrentUser,
    testWooCommerceAPI: testGetCurrentUser,
    testDebugAuth: testGetCurrentUser,
  }
}
