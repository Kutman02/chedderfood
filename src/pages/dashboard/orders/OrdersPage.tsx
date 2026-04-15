import { useEffect, useMemo, useState } from "react"

import { OrderTabs } from "../components/OrderTabs"
import { OrdersSection } from "../components/OrdersSection"
import { OrderSkeleton } from "@/components/Skeleton/components"

import { useDashboardUI } from "../hooks/useDashboardUI"
import { useOrders } from "../hooks/useOrders"
import { useOutletContext } from "react-router-dom"

import type { Product } from "@/types"

type OutletContext = {
  products: Product[]
  searchQuery: string
  setSearchMeta: (
    section: "orders" | "products" | "customers" | "categories" | "tags",
    meta: { found: number; total: number; loading?: boolean }
  ) => void
}

const OrdersPage = () => {

  const [page, setPage] = useState(1)
  const [dateMode, setDateMode] = useState<"today" | "all" | "day" | "range">("today")
  const [selectedDate, setSelectedDate] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [expandedDetailsOrderId, setExpandedDetailsOrderId] = useState<number | null>(null)

  const { products, searchQuery, setSearchMeta } = useOutletContext<OutletContext>()

  const { activeTab, setActiveTab } = useDashboardUI()
  const supportsDateFilters =
    activeTab === "completed" || activeTab === "cancelled"

  const dateFilter = useMemo(() => {
    if (!supportsDateFilters) {
      return { mode: "all" as const }
    }

    if (dateMode === "all") {
      return { mode: "all" as const }
    }

    if (dateMode === "today") {
      return { mode: "today" as const }
    }

    if (dateMode === "day") {
      return {
        mode: "day" as const,
        date: selectedDate,
      }
    }

    return {
      mode: "range" as const,
      date_from: dateFrom,
      date_to: dateTo,
    }
  }, [dateFrom, dateMode, dateTo, selectedDate, supportsDateFilters])

  const {
    orders,
    supportsDateFilters: querySupportsDateFilters,
    shouldPaginate,
    ordersLoading,
    ordersError,
    counts,
    countsRaw,
    filterCounts,
    totalPages, // ✅ ВАЖНО
    foundTotal,
    activeTabTotal,
    processingIds,
    removingOrderIds,
    expandedConfirmation,
    handleConfirmAction,
    handleConfirmStatusUpdate
  } = useOrders(activeTab, searchQuery, page, dateFilter)

  /**
   * ✅ сброс страницы
   */
  useEffect(() => {
    setPage(1)
  }, [activeTab, dateFilter, searchQuery])

  useEffect(() => {
    setExpandedDetailsOrderId(null)
  }, [activeTab, searchQuery, page, dateFilter])

  useEffect(() => {
    setSearchMeta("orders", {
      found: foundTotal,
      total: activeTabTotal,
      loading: ordersLoading,
    })
  }, [activeTabTotal, foundTotal, ordersLoading, setSearchMeta])

  const handleToggleDetails = (orderId: number) => {
    setExpandedDetailsOrderId((currentOrderId) =>
      currentOrderId === orderId ? null : orderId
    )
  }

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

  if (ordersError) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-semibold">Ошибка загрузки заказов</p>
        <p className="text-slate-400 text-sm mt-2">Пожалуйста, попробуйте позже</p>
      </div>
    )
  }

  return (
    <>
      <OrderTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={counts}
      />

      {querySupportsDateFilters && (
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setDateMode("today")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                dateMode === "today"
                  ? "bg-orange-500 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Сегодня ({filterCounts.today})
            </button>

            <button
              onClick={() => setDateMode("all")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                dateMode === "all"
                  ? "bg-orange-500 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Посмотреть все ({filterCounts.all})
            </button>

            <button
              onClick={() => setDateMode("day")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                dateMode === "day"
                  ? "bg-orange-500 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              По дате ({filterCounts.day})
            </button>

            <button
              onClick={() => setDateMode("range")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                dateMode === "range"
                  ? "bg-orange-500 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Диапазон ({filterCounts.range})
            </button>
          </div>

          {dateMode === "day" && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <label className="text-slate-600">Дата:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                aria-label="Выберите дату"
                title="Выберите дату"
                className="rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
          )}

          {dateMode === "range" && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <label className="text-slate-600">С:</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                aria-label="Начальная дата диапазона"
                title="Начальная дата диапазона"
                className="rounded-lg border border-slate-300 px-3 py-2"
              />

              <label className="text-slate-600">По:</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                aria-label="Конечная дата диапазона"
                title="Конечная дата диапазона"
                className="rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
          )}
        </div>
      )}

      {/* ✅ empty state */}
      {orders.length === 0 ? (
        <div className="text-center mt-10 text-gray-500">
          Нет заказов
        </div>
      ) : (
        <OrdersSection
          orders={orders}
          products={products}
          activeTab={activeTab}
          processingIds={processingIds}
          removingOrderIds={removingOrderIds}
          expandedConfirmation={expandedConfirmation}
          expandedDetailsOrderId={expandedDetailsOrderId}
          onConfirmAction={handleConfirmAction}
          onStatusUpdate={handleConfirmStatusUpdate}
          onToggleDetails={handleToggleDetails}
        />
      )}

      {/* 🔥 НОВАЯ PAGINATION */}
      {shouldPaginate && totalPages > 1 && (
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
      )}
    </>
  )
}

export default OrdersPage