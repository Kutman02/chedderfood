import { useAppSelector } from "@/app/hooks"
import { useAuth } from "@/hooks/useAuth"

import { useOrders } from "./useOrders"
import { useProducts } from "./useProducts"
import { useDashboardUI } from "./useDashboardUI"

export const useDashboard = () => {

  const userName = useAppSelector(s => s.auth.userName)
  const { loading: authLoading, isAuthenticated } = useAuth()

  const ui = useDashboardUI()

  const orders = useOrders(
    ui.activeTab,
    ui.searchQuery,
    ui.mainSection
  )

  const products = useProducts(
    ui.mainSection,
    ui.searchQuery
  )

  return {

    userName,
    authLoading,
    isAuthenticated,

    ...ui,
    ...orders,
    ...products

  }
}