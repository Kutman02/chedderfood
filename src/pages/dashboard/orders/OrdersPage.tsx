import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { OrderSkeleton } from "@/components/Skeleton/components"
import { OrderDetailsFullscreen } from "@/components/dashboard/OrderDetailsFullscreen/OrderDetailsFullscreen"
import { useGetAdminOrdersQuery, useGetRestaurantHoursStatusQuery } from "@/api"
import { OrderTabs } from "../components/OrderTabs"
import { useOrders } from "../hooks/useOrders"
import { OrderTabsSkeleton } from "./components/OrderTabsSkeleton"
import { OrdersDateFilters } from "./components/OrdersDateFilters"
import { OrdersPagination } from "./components/OrdersPagination"
import { ORDER_DETAILS_FIELDS, TAB_SKELETON_DELAY_MS } from "./orders.constants"
import { useOrderStatusRouting } from "./hooks/useOrderStatusRouting"
import { useOrdersAttentionSignals } from "./hooks/useOrdersAttentionSignals"
import { useOrdersSectionPreload } from "./hooks/useOrdersSectionPreload"
import type { OrdersDateMode, OrdersOutletContext } from "./orders.types"
import {
  buildDateFilter,
  normalizeOrderStatus,
  supportsDateFilters as supportsDateFiltersByStatus,
} from "./orders.utils"

const loadOrdersSection = () => import("../components/OrdersSection")

const OrdersSection = lazy(() =>
  loadOrdersSection().then((module) => ({
    default: module.OrdersSection,
  }))
)

const OrdersPage = () => {
  const navigate = useNavigate()
  const { products, searchQuery, setSearchMeta } =
    useOutletContext<OrdersOutletContext>()

  const {
    activeTab,
    setActiveTab,
    handleTabClick,
    routeOrderId,
    baseOrdersPath,
    locationSearch,
  } = useOrderStatusRouting()

  const preloadOrdersSection = useCallback(() => {
    void loadOrdersSection()
  }, [])

  useOrdersSectionPreload(preloadOrdersSection)

  const [page, setPage] = useState(1)
  const [dateMode, setDateMode] = useState<OrdersDateMode>("today")
  const [selectedDate, setSelectedDate] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [showTabSkeleton, setShowTabSkeleton] = useState(false)
  const [tabChangeLoading, setTabChangeLoading] = useState(false)
  const previousOnHoldCountRef = useRef<number | null>(null)
  const initialLoadRef = useRef(true)
  const previousTabRef = useRef<typeof activeTab | null>(null)
  const tabSkeletonTimerRef = useRef<number | null>(null)

  const { data: restaurantHoursResponse } = useGetRestaurantHoursStatusQuery(
    undefined,
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  )

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

  const supportsDateFilters = supportsDateFiltersByStatus(activeTab)

  const dateFilter = useMemo(
    () =>
      buildDateFilter(
        supportsDateFilters,
        dateMode,
        selectedDate,
        dateFrom,
        dateTo
      ),
    [dateFrom, dateMode, dateTo, selectedDate, supportsDateFilters]
  )

  const {
    orders,
    supportsDateFilters: querySupportsDateFilters,
    shouldPaginate,
    ordersLoading,
    ordersError,
    counts,
    countsRaw,
    filterCounts,
    totalPages,
    foundTotal,
    activeTabTotal,
    processingIds,
    removingOrderIds,
    expandedConfirmation,
    handleConfirmAction,
    handleConfirmStatusUpdate,
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
    if (!tabChangeLoading || !ordersLoading) return

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
    () => routeOrderId !== null && orders.some((order) => order.id === routeOrderId),
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
    return orders.find((order) => order.id === routeOrderId) ?? lookupOrder
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
    initialLoadRef.current &&
    ordersLoading &&
    querySupportsDateFilters &&
    !isDetailsOpen

  const onHoldCount = countsRaw["on-hold"] || 0

  useOrdersAttentionSignals({
    activeTab,
    onHoldCount,
  })

  const handleViewDetails = useCallback((nextOrderId: number) => {
    if (routeOrderId === nextOrderId) {
      navigate(baseOrdersPath, { replace: true })
      return
    }

    navigate(`/dashboard/orders/${nextOrderId}${locationSearch}`)
  }, [baseOrdersPath, locationSearch, navigate, routeOrderId])

  const handleCloseDetails = useCallback(() => {
    if (routeOrderId !== null) {
      handleConfirmAction(routeOrderId, "")
    }

    navigate(baseOrdersPath, { replace: true })
  }, [baseOrdersPath, handleConfirmAction, navigate, routeOrderId])

  if (ordersError) {
    return (
      <div className="py-20 text-center">
        <p className="font-semibold text-red-500">Ошибка загрузки заказов</p>
        <p className="mt-2 text-sm text-slate-400">Пожалуйста, попробуйте позже</p>
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

      {showTabSkeleton && <OrderTabsSkeleton />}

      <OrdersDateFilters
        showHeaderSkeleton={showHeaderSkeleton}
        querySupportsDateFilters={querySupportsDateFilters}
        isDetailsOpen={isDetailsOpen}
        backendTimezone={backendTimezone}
        backendTime={backendTime}
        dateMode={dateMode}
        filterCounts={filterCounts}
        selectedDate={selectedDate}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateModeChange={setDateMode}
        onSelectedDateChange={setSelectedDate}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />

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
          <div className="mt-10 text-center text-gray-500">Нет заказов</div>
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

      <OrdersPagination
        isDetailsOpen={isDetailsOpen}
        shouldPaginate={shouldPaginate}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
      />
    </>
  )
}

export default OrdersPage