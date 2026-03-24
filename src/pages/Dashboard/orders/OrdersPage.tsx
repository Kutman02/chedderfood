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
    countsRaw,
    totalPages, // ✅ ВАЖНО
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

    const newCount = countsRaw["on-hold"] || 0

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

  }, [countsRaw["on-hold"], activeTab])

  /**
   * 🔴 мигающий title
   */
  useEffect(() => {

    if (activeTab !== "on-hold") return

    const newOrders = countsRaw["on-hold"] || 0
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

  }, [countsRaw["on-hold"], activeTab])

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

      {/* ✅ empty state */}
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

      {/* 🔥 НОВАЯ PAGINATION */}
      <div className="flex items-center justify-center gap-2 mt-6">

        {/* Previous */}
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 text-gray-600 disabled:opacity-50"
        >
          ← Назад
        </button>

        {/* Pages */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(p => {
            return (
              p === 1 ||
              p === totalPages ||
              Math.abs(p - page) <= 1
            )
          })
          .map((p, index, arr) => {

            const prev = arr[index - 1]

            return (
              <span key={p} className="flex items-center">

                {/* dots */}
                {prev && p - prev > 1 && (
                  <span className="px-2 text-gray-400">...</span>
                )}

                <button
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded ${
                    p === page
                      ? "bg-gray-200 font-semibold"
                      : "text-gray-600"
                  }`}
                >
                  {p}
                </button>

              </span>
            )
          })}

        {/* Next */}
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 text-gray-600 disabled:opacity-50"
        >
          Вперёд →
        </button>

      </div>
    </>
  )
}

export default OrdersPage