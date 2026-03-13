import { useEffect } from "react"

import { OrderTabs } from "../components/OrderTabs"
import { OrdersSection } from "../components/OrdersSection"
import { OrderSkeleton } from "@/components/Skeleton/components"

import { useDashboardUI } from "../hooks/useDashboardUI"
import { useOrders } from "../hooks/useOrders"
import { useOutletContext } from "react-router-dom"

const OrdersPage = () => {

  const {
    activeTab,
    setActiveTab,
    searchQuery
  } = useDashboardUI()

  const { handleViewDetails } = useOutletContext<{
    handleViewDetails: (order: any) => void
  }>()

  const {
    orders,
    ordersLoading,
    counts,
    processingIds,
    removingOrderIds,
    expandedConfirmation,
    handleConfirmAction,
    handleConfirmStatusUpdate
  } = useOrders(activeTab, searchQuery)

  /**
   * 🔐 запрос разрешения на уведомления
   */
  useEffect(() => {

    if ("Notification" in window) {

      if (Notification.permission === "default") {
        Notification.requestPermission()
      }

    }

  }, [])

  /**
   * 🔔 звук нового заказа
   */
  useEffect(() => {

    const newCount = counts["on-hold"] || 0

    const prevCount = Number(
      sessionStorage.getItem("orders_on_hold_count") || 0
    )

    if (newCount > prevCount) {

      const audio = new Audio("/sounds/new-order.mp3")

      audio.play().catch(() => {
        console.warn("Звук заблокирован браузером")
      })

      /**
       * 🖥 browser notification
       */
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

  }, [counts])

  /**
   * 🔴 мигающий title вкладки
   */
  useEffect(() => {

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

  }, [counts])

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
    </>
  )
}

export default OrdersPage
