import { Outlet, useLocation } from "react-router-dom"

import { Header } from "@/components/Dashboard/Header/Header"
import { SectionsNav } from "./components/SectionsNav"
import { SearchBar } from "./components/SearchBar"

import { useDashboardUI } from "./hooks/useDashboardUI"
import { useAuth } from "@/hooks/useAuth"
import { useAppSelector } from "@/app/hooks"

import { OrderDetailsModal } from "@/components/Dashboard/OrderDetailsModal/OrderDetailsModal"
import { AddProductModal } from "@/components/Dashboard/AddProductModal/AddProductModal"
import { EditProductModal } from "@/components/Dashboard/EditProductModal/EditProductModal"
import { useGetWooOrdersQuery } from "@/app/services/wooCommerceApi"

const DashboardLayout = () => {

  const location = useLocation()

  const { data: ordersData } = useGetWooOrdersQuery(
    { per_page: 100 },
    { pollingInterval: 15000 }
  )

  const ordersCount = ordersData?.length ?? 0

  const userName = useAppSelector(s => s.auth.userName)
  const { loading: authLoading, isAuthenticated } = useAuth()

  const {

    searchQueries,
    setSearchQuery,

    showSettings,
    setShowSettings,

    showAddProductModal,
    setShowAddProductModal,

    showEditProductModal,
    setShowEditProductModal,

    selectedProduct,

    orderDetailsModal,
    setOrderDetailsModal,

    handleViewDetails,
    handleEditProduct,

    getPlaceholder

  } = useDashboardUI()

  // определяем текущую секцию
  const section =
    location.pathname.includes("/products")
      ? "products"
      : location.pathname.includes("/customers")
      ? "customers"
      : "orders"

  if (!isAuthenticated && !authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        Требуется авторизация
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <Header
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        userName={userName}
      />

      <div className="max-w-7xl mx-auto px-4 py-4">

        <SectionsNav ordersCount={ordersCount} />

        <SearchBar
          value={searchQueries[section]}
          onChange={(v) => setSearchQuery(section, v)}
          placeholder={getPlaceholder(section)}
        />

        <main className="mt-6">
          <Outlet
            context={{
              handleViewDetails,
              handleEditProduct,
              setShowAddProductModal,
              searchQuery: searchQueries[section]
            }}
          />
        </main>

      </div>

      <OrderDetailsModal
        isOpen={orderDetailsModal.isOpen}
        order={orderDetailsModal.order}
        onClose={() =>
          setOrderDetailsModal({
            isOpen: false,
            order: null
          })
        }
      />

      <AddProductModal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
      />

      <EditProductModal
        isOpen={showEditProductModal}
        product={selectedProduct}
        onClose={() => setShowEditProductModal(false)}
      />

    </div>
  )
}

export default DashboardLayout
