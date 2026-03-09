import { useState } from "react"
import { authService } from "../../../app/services/authService"
import { userService } from "../../../app/services/userService"
import {
  API_BASE_URL,
  WOOCOMMERCE_CONSUMER_KEY,
  WOOCOMMERCE_CONSUMER_SECRET
} from "../../../app/services/apiConfig"

import type { AuthResult } from "../types"

export const useAuthTest = () => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState<AuthResult | null>(null)
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult(null)

    try {
      const data = await authService.login({ username, password })
      setResult(data)
    } catch (error) {
      setResult({ error: (error as Error).message })
    } finally {
      setLoading(false)
    }
  }

  const testGetCurrentUser = async () => {
    try {
      const user = await userService.getCurrentUser()

      if (user) {
        setResult({
          data: { ...user },
          message: "Current user fetched successfully",
          success: true
        })
      } else {
        setResult({
          message: "Failed to get current user"
        })
      }
    } catch (error) {
      setResult({ error: (error as Error).message })
    }
  }

  const testAppPassword = () => {
    const hasAppPassword = authService.hasAppPassword()

    setResult({
      message: hasAppPassword
        ? "Application Password configured ✅"
        : "Application Password NOT configured ❌",
      success: hasAppPassword
    })
  }

  const testWooCommerceAPI = async () => {

    try {

      if (!WOOCOMMERCE_CONSUMER_KEY || !WOOCOMMERCE_CONSUMER_SECRET) {

        setResult({
          error: "WooCommerce API keys not configured"
        })

        return
      }

      const credentials = btoa(
        `${WOOCOMMERCE_CONSUMER_KEY}:${WOOCOMMERCE_CONSUMER_SECRET}`
      )

      const response = await fetch(
        `${API_BASE_URL}wc/v3/orders?status=on-hold&per_page=10`,
        {
          headers: {
            Authorization: `Basic ${credentials}`
          }
        }
      )

      if (response.ok) {

        const data = await response.json()

        setResult({
          data: { count: data.length },
          message: `WooCommerce API working`
        })

      } else {

        setResult({
          error: `HTTP ${response.status}`
        })

      }

    } catch (error) {

      setResult({
        error: (error as Error).message
      })

    }

  }

  const testDebugAuth = () => {
    userService.debugAuthStatus()
    setResult({ message: "Debug info logged to console" })
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