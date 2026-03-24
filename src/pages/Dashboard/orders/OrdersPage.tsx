import { useEffect, useState } from "react"

import { OrderTabs } from "../components/OrderTabs"
import { OrdersSection } from "../components/OrdersSection"
import { OrderSkeleton } from "@/components/Skeleton/components"

import { useDashboardUI } from "../hooks/useDashboardUI"
import { useOrders } from "../hooks/useOrders"
import { useOutletContext } from "react-router-dom"

type OutletContext = {
  handleViewDetails: (order: any) => void
  searchQuery: string
}

const OrdersPage = () => {

  const [page, setPage] = useState(1)

  const { handleViewDetails, searchQuery } = useOutletContext<OutletContext>()

  const { activeTab, setActiveTab } = useDashboardUI()

  const {
    orders,
    ordersLoading,
    counts,
    processingIds,
    removingOrderIds,
    expandedConfirmation,
    handleConfirmAction,
    handleConfirmStatusUpdate
  } = useOrders(activeTab, searchQuery, page)

  /**
   * ✅ сброс страницы
   */
  useEffect(() => {
    setPage(1)
  }, [activeTab, searchQuery])

  /**
   * 🔔 звук нового заказа (только on-hold)
   */
  useEffect(() => {

    if (activeTab !== "on-hold") return

    const newCount = counts["on-hold"] || 0
    const prevCount = Number(
      sessionStorage.getItem("orders_on_hold_count") || 0
    )

    if (newCount > prevCount) {

      const audio = new Audio("/sounds/new-order.mp3")

      audio.play().catch(() => {
        console.warn("Звук заблокирован браузером")
      })

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Новый заказ!", {
          body: `Поступил новый заказ. Всего новых: ${newCount}`,
          icon: "/logo192.png"
        })
      }
    }

    sessionStorage.setItem(
      "orders_on_hold_count",
      String(newCount)
    )

  }, [counts["on-hold"], activeTab]) // ✅ фикс зависимости

  /**
   * 🔴 мигающий title (только on-hold)
   */
  useEffect(() => {

    if (activeTab !== "on-hold") return

    const newOrders = counts["on-hold"] || 0
    const originalTitle = document.title

    if (newOrders <= 0) {
      document.title = originalTitle
      return
    }

    let visible = false

    const interval = setInterval(() => {
      document.title = visible
        ? `(${newOrders}) Новый заказ!`
        : originalTitle

      visible = !visible
    }, 3000)

    return () => {
      clearInterval(interval)
      document.title = originalTitle
    }

  }, [counts["on-hold"], activeTab]) // ✅ фикс зависимости

  if (ordersLoading) {
    return <OrderSkeleton count={5} />
  }

  return (
    <>
      <OrderTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={counts}
      />

      {/* ✅ если нет заказов */}
      {orders.length === 0 ? (
        <div className="text-center mt-10 text-gray-500">
          Нет заказов
        </div>
      ) : (
        <OrdersSection
          orders={orders}
          activeTab={activeTab}
          processingIds={processingIds}
          removingOrderIds={removingOrderIds}
          expandedConfirmation={expandedConfirmation}
          onConfirmAction={handleConfirmAction}
          onStatusUpdate={handleConfirmStatusUpdate}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* ✅ Pagination */}
      <div className="flex gap-2 mt-4 justify-center">

        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          className="px-3 py-1 bg-gray-200 rounded"
          disabled={page === 1}
        >
          Назад
        </button>

        <span className="px-2">Страница {page}</span>

        <button
          onClick={() => setPage(p => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Вперёд
        </button>

      </div>
    </>
  )
}

export default OrdersPage