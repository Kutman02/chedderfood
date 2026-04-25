import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react"

import { OrderTabs } from "../components/OrderTabs"
import { OrderSkeleton } from "@/components/Skeleton/components"
import { OrderDetailsFullscreen } from "@/components/dashboard/OrderDetailsFullscreen/OrderDetailsFullscreen"

import { useOrders } from "../hooks/useOrders"
import { useLocation, useNavigate, useOutletContext, useParams, useSearchParams } from "react-router-dom"
import { useGetAdminOrdersQuery, useGetRestaurantHoursStatusQuery } from "@/api"

import type { OrderStatus, Product } from "@/types"

const ORDER_STATUS_TABS: OrderStatus[] = [
  "on-hold",
  "processing",
  "ready",
  "completed",
  "cancelled",
]

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  "on-hold": "Новые",
  processing: "Готовятся",
  ready: "Готовые",
  completed: "Завершён",
  cancelled: "Отменённые",
}

const FILTER_SKELETON_WIDTHS = [
  96,
  136,
  112,
  120,
]

const TAB_SKELETON_DELAY_MS = 250
const TAB_SKELETON_MIN_WIDTH = 80
const TAB_SKELETON_MAX_WIDTH = 180
const TAB_SKELETON_CHAR_WIDTH = 8
const TAB_SKELETON_PADDING = 32
const ORDERS_SECTION_PRELOAD_DELAY_MS = 350

const ORDER_DETAILS_FIELDS = "id,status,reason,changed_at,changed_by_user_id,total,customer_name,phone,address,apartment_office,floor,order_type,customer_note,needs_cutlery_and_napkins,pickup_address,pickup_map_url,pickup_2gis_url,line_items,status_history,meta_data,date_created,date_created_unix,date_created_human"

const getTabSkeletonWidth = (status: OrderStatus) => {
  const label = ORDER_STATUS_LABELS[status] || ""
  const width = Math.min(
    TAB_SKELETON_MAX_WIDTH,
    Math.max(
      TAB_SKELETON_MIN_WIDTH,
      label.length * TAB_SKELETON_CHAR_WIDTH + TAB_SKELETON_PADDING
    )
  )

  return `${width}px`
}

const loadOrdersSection = () => import("../components/OrdersSection")

const OrdersSection = lazy(() =>
  loadOrdersSection().then((module) => ({
    default: module.OrdersSection,
  }))
)

const DEFAULT_ORDER_STATUS: OrderStatus = "on-hold"

const parseOrderStatusFromQuery = (value: string | null): OrderStatus | null => {
  if (!value) return null

  const normalized = value.trim().toLowerCase() as OrderStatus

  return ORDER_STATUS_TABS.includes(normalized)
    ? normalized
    : null
}

const normalizeOrderStatus = (value: unknown): OrderStatus => {
  const normalized = String(value || "on-hold").trim().toLowerCase()

  if (normalized === "pending") return "on-hold"
  if (normalized === "canceled") return "cancelled"

  if (
    normalized === "on-hold" ||
    normalized === "processing" ||
    normalized === "ready" ||
    normalized === "completed" ||
    normalized === "cancelled"
  ) {
    return normalized
  }

  return "on-hold"
}

type OutletContext = {
  products: Product[]
  searchQuery: string
  setSearchMeta: (
    section: "orders" | "products" | "customers" | "categories" | "tags",
    meta: { found: number; total: number; loading?: boolean }
  ) => void
}

const OrdersPage = () => {

  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { orderId } = useParams()
  const [page, setPage] = useState(1)
  const [dateMode, setDateMode] = useState<"today" | "all" | "day" | "range">("today")
  const [selectedDate, setSelectedDate] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [showTabSkeleton, setShowTabSkeleton] = useState(false)
  const [tabChangeLoading, setTabChangeLoading] = useState(false)
  const previousOnHoldCountRef = useRef<number | null>(null)
  const initialLoadRef = useRef(true)
  const previousTabRef = useRef<OrderStatus | null>(null)
  const tabSkeletonTimerRef = useRef<number | null>(null)

  const routeOrderId = useMemo(() => {
    if (!orderId) return null
    const parsed = Number(orderId)

    if (!Number.isFinite(parsed) || parsed <= 0) {
      return null
    }

    return parsed
  }, [orderId])

  const { products, searchQuery, setSearchMeta } = useOutletContext<OutletContext>()

  const { data: restaurantHoursResponse } = useGetRestaurantHoursStatusQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  })

  useEffect(() => {
    const idleCallbacks = window as typeof window & {
      requestIdleCallback?: (callback: () => void) => number
      cancelIdleCallback?: (id: number) => void
    }

    if (idleCallbacks.requestIdleCallback) {
      const idleId = idleCallbacks.requestIdleCallback(() => {
        loadOrdersSection()
      })

      return () => idleCallbacks.cancelIdleCallback?.(idleId)
    }

    const timeoutId = window.setTimeout(() => {
      loadOrdersSection()
    }, ORDERS_SECTION_PRELOAD_DELAY_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  const backendTimezone = restaurantHoursResponse?.data?.timezone || "Asia/Bishkek"

  const backendTime = useMemo(() => {
    const sourceDate = restaurantHoursResponse?.data?.now_local
      ? new Date(restaurantHoursResponse.data.now_local)
      : new Date()

    return new Intl.DateTimeFormat("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: backendTimezone,
    }).format(sourceDate)
  }, [backendTimezone, restaurantHoursResponse?.data?.now_local])

  const activeTab = useMemo<OrderStatus>(() => {
    const fromQuery = parseOrderStatusFromQuery(searchParams.get("status"))
    return fromQuery ?? DEFAULT_ORDER_STATUS
  }, [searchParams])

  const setActiveTab = useCallback((nextStatus: OrderStatus) => {
    const normalizedStatus = parseOrderStatusFromQuery(nextStatus) ?? DEFAULT_ORDER_STATUS
    const nextParams = new URLSearchParams(searchParams)

    if (normalizedStatus === DEFAULT_ORDER_STATUS) {
      nextParams.delete("status")
    } else {
      nextParams.set("status", normalizedStatus)
    }

    setSearchParams(nextParams, { replace: true })
  }, [searchParams, setSearchParams])

  const handleTabClick = useCallback((nextStatus: OrderStatus) => {
    if (nextStatus === activeTab) return
    if (routeOrderId !== null) {
      navigate(`/dashboard/orders${location.search}`, { replace: true })
    }
    setActiveTab(nextStatus)
  }, [activeTab, location.search, navigate, routeOrderId, setActiveTab])

  useEffect(() => {
    const rawStatus = searchParams.get("status")
    if (!rawStatus) {
      return
    }

    const normalizedStatus = parseOrderStatusFromQuery(rawStatus)
    const nextParams = new URLSearchParams(searchParams)

    if (!normalizedStatus) {
      nextParams.delete("status")
      setSearchParams(nextParams, { replace: true })
      return
    }

    if (normalizedStatus !== rawStatus) {
      nextParams.set("status", normalizedStatus)
      setSearchParams(nextParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

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

  useEffect(() => {
    if (previousTabRef.current === null) {
      previousTabRef.current = activeTab
      return
    }

    if (previousTabRef.current !== activeTab) {
      previousTabRef.current = activeTab
      setShowTabSkeleton(false)
      setTabChangeLoading(true)
    }
  }, [activeTab])

  useEffect(() => {
    if (!tabChangeLoading) return
    if (!ordersLoading) return

    if (tabSkeletonTimerRef.current) {
      clearTimeout(tabSkeletonTimerRef.current)
    }

    tabSkeletonTimerRef.current = window.setTimeout(() => {
      setShowTabSkeleton(true)
    }, TAB_SKELETON_DELAY_MS)

    return () => {
      if (tabSkeletonTimerRef.current) {
        clearTimeout(tabSkeletonTimerRef.current)
        tabSkeletonTimerRef.current = null
      }
    }
  }, [ordersLoading, tabChangeLoading])

  useEffect(() => {
    if (!tabChangeLoading) return

    if (!ordersLoading) {
      setTabChangeLoading(false)
      setShowTabSkeleton(false)
    }
  }, [ordersLoading, tabChangeLoading])

  useEffect(() => {
    if (!ordersLoading && initialLoadRef.current) {
      initialLoadRef.current = false
    }
  }, [ordersLoading])

  /**
   * ✅ сброс страницы
   */
  useEffect(() => {
    setPage(1)
  }, [activeTab, dateFilter, searchQuery])

  useEffect(() => {
    const currentOnHoldCount = countsRaw["on-hold"] || 0

    if (previousOnHoldCountRef.current === null) {
      previousOnHoldCountRef.current = currentOnHoldCount
      return
    }

    if (
      currentOnHoldCount > previousOnHoldCountRef.current &&
      activeTab !== "on-hold"
    ) {
      setActiveTab("on-hold")
    }

    previousOnHoldCountRef.current = currentOnHoldCount
  }, [activeTab, countsRaw, setActiveTab])

  useEffect(() => {
    setSearchMeta("orders", {
      found: foundTotal,
      total: activeTabTotal,
      loading: ordersLoading,
    })
  }, [activeTabTotal, foundTotal, ordersLoading, setSearchMeta])

  const hasOrderInList = useMemo(
    () => routeOrderId !== null && orders.some(order => order.id === routeOrderId),
    [orders, routeOrderId]
  )

  const orderLookupParams = routeOrderId !== null
    ? {
        page: 1,
        per_page: 1,
        search: String(routeOrderId),
        scope: "all" as const,
        fields: ORDER_DETAILS_FIELDS,
      }
    : undefined

  const { data: orderLookupResponse, isFetching: orderLookupFetching } =
    useGetAdminOrdersQuery(orderLookupParams, {
      skip: routeOrderId === null || hasOrderInList,
    })

  const lookupOrder = orderLookupResponse?.data?.[0] ?? null

  const selectedOrder = useMemo(() => {
    if (routeOrderId === null) return null
    return orders.find(order => order.id === routeOrderId) ?? lookupOrder
  }, [lookupOrder, orders, routeOrderId])

  const detailsTab = useMemo(() => {
    if (!selectedOrder) return activeTab
    return normalizeOrderStatus(selectedOrder.status)
  }, [activeTab, selectedOrder])

  const isDetailsOpen = routeOrderId !== null
  const isDetailsLoading =
    isDetailsOpen && !selectedOrder && (ordersLoading || orderLookupFetching)
  const isListLoading = (ordersLoading || showTabSkeleton) && !isDetailsOpen
  const listFallback = <OrderSkeleton count={5} />
  const showHeaderSkeleton =
    initialLoadRef.current && ordersLoading && querySupportsDateFilters && !isDetailsOpen
  const filterSkeleton = (
    <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 h-3 w-64 animate-pulse rounded bg-slate-100" />
      <div className="flex flex-wrap items-center gap-2">
        {FILTER_SKELETON_WIDTHS.map((width, index) => (
          <div
            key={`filters-skeleton-${index}`}
            style={{ width: `${width}px` }}
            className="h-9 animate-pulse rounded-lg bg-slate-100"
          />
        ))}
      </div>
    </div>
  )

  const baseOrdersPath = useMemo(
    () => `/dashboard/orders${location.search}`,
    [location.search]
  )

  const handleViewDetails = useCallback((nextOrderId: number) => {
    if (routeOrderId === nextOrderId) {
      navigate(baseOrdersPath, { replace: true })
      return
    }

    navigate(`/dashboard/orders/${nextOrderId}${location.search}`)
  }, [baseOrdersPath, location.search, navigate, routeOrderId])

  const handleCloseDetails = useCallback(() => {
    if (routeOrderId !== null) {
      handleConfirmAction(routeOrderId, "")
    }

    navigate(baseOrdersPath, { replace: true })
  }, [baseOrdersPath, handleConfirmAction, navigate, routeOrderId])

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
        setActiveTab={handleTabClick}
        counts={counts}
      />

      {showTabSkeleton && (
        <div className="mb-4 flex flex-wrap gap-2">
          {ORDER_STATUS_TABS.map((status) => (
            <div
              key={`order-tabs-skeleton-${status}`}
              style={{ width: getTabSkeletonWidth(status) }}
              className="h-8 animate-pulse rounded-lg bg-slate-100"
            />
          ))}
        </div>
      )}

      {showHeaderSkeleton ? (
        filterSkeleton
      ) : querySupportsDateFilters && !isDetailsOpen ? (
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
          <p className="mb-3 text-xs font-medium text-slate-500">
            Часовой пояс сервера: <span className="font-semibold text-slate-700">{backendTimezone}</span>
            {" · "}
            Время: <span className="font-semibold text-slate-700">{backendTime}</span>
          </p>

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
      ) : null}

      <Suspense fallback={listFallback}>
        {isListLoading ? (
          listFallback
        ) : isDetailsOpen ? (
          selectedOrder ? (
            <OrderDetailsFullscreen
              key={selectedOrder.id}
              order={selectedOrder}
              products={products}
              activeTab={detailsTab}
              isProcessing={processingIds.has(selectedOrder.id)}
              showConfirmation={expandedConfirmation.orderId === selectedOrder.id}
              confirmationAction={
                expandedConfirmation.orderId === selectedOrder.id
                  ? expandedConfirmation.action || ""
                  : ""
              }
              onConfirmAction={handleConfirmAction}
              onStatusUpdate={handleConfirmStatusUpdate}
              onClose={handleCloseDetails}
            />
          ) : isDetailsLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-slate-600">
              Загрузка заказа...
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-slate-600">
              <p className="font-semibold">Заказ не найден</p>
              <button
                type="button"
                onClick={handleCloseDetails}
                className="mt-4 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Назад к заказам
              </button>
            </div>
          )
        ) : orders.length === 0 ? (
          <div className="text-center mt-10 text-gray-500">
            Нет заказов
          </div>
        ) : (
          <OrdersSection
            orders={orders}
            activeTab={activeTab}
            processingIds={processingIds}
            removingOrderIds={removingOrderIds}
            onViewDetails={handleViewDetails}
          />
        )}
      </Suspense>

      {/* 🔥 НОВАЯ PAGINATION */}
      {!isDetailsOpen && shouldPaginate && totalPages > 1 && (
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