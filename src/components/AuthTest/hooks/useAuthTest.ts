import { useState } from "react"

import { useLazyGetMeQuery } from "@/api"
import {
  API_BASE_URL,
  WOOCOMMERCE_CONSUMER_KEY,
  WOOCOMMERCE_CONSUMER_SECRET
} from "@/app/services/apiConfig"

import type { AuthResult } from "../types"

// ===============================
// Лог-метки
// ===============================

const LOG = {
  info: "🔍",
  success: "✅",
  error: "❌",
  warn: "⚠️",
}

// ===============================
// Hook
// ===============================

export const useAuthTest = () => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState<AuthResult | null>(null)
  const [loading, setLoading] = useState(false)

  const [getMe] = useLazyGetMeQuery()

  // =========================
  // TEST LOGIN (RTK Query)
  // =========================
  const testLogin = async () => {

    setLoading(true)
    setResult(null)

    try {

      console.log(`${LOG.info} Проверка логина через API`)

      const user = await getMe().unwrap()

      console.log(`${LOG.success} Успешный ответ`, user)

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

  // =========================
  // TEST API KEYS
  // =========================
  const testAppPassword = () => {

    const isConfigured =
      !!WOOCOMMERCE_CONSUMER_KEY &&
      !!WOOCOMMERCE_CONSUMER_SECRET

    console.log(`${LOG.info} Проверка WooCommerce ключей`)

    setResult({
      success: isConfigured,
      message: isConfigured
        ? "API ключи настроены"
        : "API ключи НЕ настроены"
    })

  }

  // =========================
  // TEST WooCommerce API
  // =========================
  const testWooCommerceAPI = async () => {

    try {

      if (!WOOCOMMERCE_CONSUMER_KEY || !WOOCOMMERCE_CONSUMER_SECRET) {

        console.error(`${LOG.error} WooCommerce ключи отсутствуют`)

        setResult({
          success: false,
          error: "WooCommerce API ключи не настроены"
        })

        return
      }

      console.log(`${LOG.info} Запрос к WooCommerce API`)

      const credentials = btoa(
        `${WOOCOMMERCE_CONSUMER_KEY}:${WOOCOMMERCE_CONSUMER_SECRET}`
      )

      const url = `${API_BASE_URL}wc/v3/orders?status=on-hold&per_page=10`

      console.log("  - URL:", url)

      const response = await fetch(url, {
        headers: {
          Authorization: `Basic ${credentials}`
        }
      })

      console.log("  - HTTP статус:", response.status)

      if (response.ok) {

        const data = await response.json()

        console.log(`${LOG.success} Ответ получен`, data)

        setResult({
          success: true,
          data: { count: data.length },
          message: "WooCommerce API работает"
        })

      } else {

        console.error(`${LOG.error} Ошибка ответа`)

        setResult({
          success: false,
          error: `HTTP ${response.status}`
        })

      }

    } catch (error) {

      console.error(`${LOG.error} Ошибка запроса`, error)

      setResult({
        success: false,
        error: (error as Error).message
      })

    }

  }

  // =========================
  // DEBUG
  // =========================
  const testDebugAuth = () => {

    console.log(`${LOG.info} Отладка конфигурации`)

    console.log("  - API_BASE_URL:", API_BASE_URL)
    console.log(
      "  - WooCommerce ключ:",
      WOOCOMMERCE_CONSUMER_KEY ? `${LOG.success} Есть` : `${LOG.error} Нет`
    )
    console.log(
      "  - WooCommerce секрет:",
      WOOCOMMERCE_CONSUMER_SECRET ? `${LOG.success} Есть` : `${LOG.error} Нет`
    )

    setResult({
      success: true,
      message: "Отладочная информация выведена в консоль"
    })

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
    testAppPassword,
    testWooCommerceAPI,
    testDebugAuth

  }

}