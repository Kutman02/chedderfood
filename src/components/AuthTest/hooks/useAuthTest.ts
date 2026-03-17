import { useState } from "react"

import { useLazyGetMeQuery } from "@/api"
import {
  API_BASE_URL,
  WOOCOMMERCE_CONSUMER_KEY,
  WOOCOMMERCE_CONSUMER_SECRET
} from "@/app/services/apiConfig"

import type { AuthResult } from "../types"

export const useAuthTest = () => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState<AuthResult | null>(null)
  const [loading, setLoading] = useState(false)

  // ✅ RTK Query
  const [getMe] = useLazyGetMeQuery()

  // =========================
  // TEST LOGIN (через RTK)
  // =========================
  const testLogin = async () => {

    setLoading(true)
    setResult(null)

    try {

      const user = await getMe().unwrap()

      setResult({
        success: true,
        message: "Login success",
        data: user
      })

    } catch (error) {

      setResult({
        success: false,
        error: "Auth failed"
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

      const user = await getMe().unwrap()

      setResult({
        success: true,
        message: "Current user fetched",
        data: user
      })

    } catch (error) {

      setResult({
        success: false,
        message: "Failed to get current user"
      })

    }

  }

  // =========================
  // TEST APP PASSWORD CONFIG
  // =========================
  const testAppPassword = () => {

    const isConfigured =
      !!WOOCOMMERCE_CONSUMER_KEY &&
      !!WOOCOMMERCE_CONSUMER_SECRET

    setResult({
      success: isConfigured,
      message: isConfigured
        ? "API keys configured ✅"
        : "API keys NOT configured ❌"
    })

  }

  // =========================
  // TEST WooCommerce API
  // =========================
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
          success: true,
          data: { count: data.length },
          message: "WooCommerce API working"
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

  // =========================
  // DEBUG
  // =========================
  const testDebugAuth = () => {

    console.log("🔍 Debug Auth:")
    console.log("Base URL:", API_BASE_URL)

    setResult({
      message: "Debug info logged"
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