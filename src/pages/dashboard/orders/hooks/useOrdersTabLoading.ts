import { useEffect, useRef, useState } from "react"
import type { OrderStatus } from "@/types"
import { TAB_SKELETON_DELAY_MS } from "../orders.constants"

type UseOrdersTabLoadingArgs = {
  activeTab: OrderStatus
  ordersLoading: boolean
  querySupportsDateFilters: boolean
  isDetailsOpen: boolean
}

export const useOrdersTabLoading = ({
  activeTab,
  ordersLoading,
  querySupportsDateFilters,
  isDetailsOpen,
}: UseOrdersTabLoadingArgs) => {
  const [showTabSkeleton, setShowTabSkeleton] = useState(false)
  const [tabChangeLoading, setTabChangeLoading] = useState(false)

  const initialLoadRef = useRef(true)
  const previousTabRef = useRef<OrderStatus | null>(null)
  const tabSkeletonTimerRef = useRef<number | null>(null)

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

  const showHeaderSkeleton =
    initialLoadRef.current &&
    ordersLoading &&
    querySupportsDateFilters &&
    !isDetailsOpen

  return {
    showTabSkeleton,
    showHeaderSkeleton,
  }
}
