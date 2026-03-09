import { useState } from "react"
import { wooCommerceApi } from "../../app/services/wooCommerceApi"

import type { TestResult } from "./types"

import { ApiTestCard } from "./components/ApiTestCard"
import { ResultBlock } from "./components/ResultBlock"
import { ErrorBlock } from "./components/ErrorBlock"
import { DebugInfo } from "./components/DebugInfo"

const WooCommerceTest = () => {
  const [result, setResult] = useState<TestResult | null>(null)

  const {
    data: ordersData,
    error: ordersError,
    isLoading: ordersLoading,
  } = wooCommerceApi.useGetWooOrdersQuery({ status: "on-hold" })

  const {
    data: productsData,
    error: productsError,
    isLoading: productsLoading,
  } = wooCommerceApi.useGetWooProductsQuery({})

  const testWooCommerceOrders = () => {
    if (ordersError) {
      setResult({
        error: ordersError,
        message: "WooCommerce Orders API failed",
      })
      return
    }

    if (ordersData) {
      const count = Array.isArray(ordersData) ? ordersData.length : 0

      setResult({
        data: { success: true, count },
        message: `WooCommerce Orders working - found ${count} orders`,
      })
    }
  }

  const testWooCommerceProducts = () => {
    if (productsError) {
      setResult({
        error: productsError,
        message: "WooCommerce Products API failed",
      })
      return
    }

    if (productsData) {
      const count = Array.isArray(productsData) ? productsData.length : 0

      setResult({
        data: { success: true, count },
        message: `WooCommerce Products working - found ${count} products`,
      })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">WooCommerce API Test</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ApiTestCard
            title="Orders"
            loading={ordersLoading}
            error={ordersError}
            data={ordersData}
            buttonText="Test Orders API"
            color="blue"
            onTest={testWooCommerceOrders}
          />

          <ApiTestCard
            title="Products"
            loading={productsLoading}
            error={productsError}
            data={productsData}
            buttonText="Test Products API"
            color="green"
            onTest={testWooCommerceProducts}
          />
        </div>

        <ResultBlock result={result} />

        <ErrorBlock title="Orders Error" error={ordersError} />
        <ErrorBlock title="Products Error" error={productsError} />

        <DebugInfo />
      </div>
    </div>
  )
}

export default WooCommerceTest