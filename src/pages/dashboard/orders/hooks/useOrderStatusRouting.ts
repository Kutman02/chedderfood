import { useCallback, useEffect, useMemo } from "react"
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom"
import type { OrderStatus } from "@/types"
import { DEFAULT_ORDER_STATUS } from "../orders.constants"
import {
  parseOrderStatusFromQuery,
  parseRouteOrderId,
} from "../orders.utils"

export const useOrderStatusRouting = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { orderId } = useParams()

  const routeOrderId = useMemo(() => parseRouteOrderId(orderId), [orderId])

  const activeTab = useMemo<OrderStatus>(() => {
    const fromQuery = parseOrderStatusFromQuery(searchParams.get("status"))
    return fromQuery ?? DEFAULT_ORDER_STATUS
  }, [searchParams])

  const setActiveTab = useCallback((nextStatus: OrderStatus) => {
    const normalizedStatus =
      parseOrderStatusFromQuery(nextStatus) ?? DEFAULT_ORDER_STATUS

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

  const baseOrdersPath = useMemo(
    () => `/dashboard/orders${location.search}`,
    [location.search]
  )

  return {
    activeTab,
    setActiveTab,
    handleTabClick,
    routeOrderId,
    baseOrdersPath,
    locationSearch: location.search,
  }
}
