import { Outlet, useLocation, Navigate } from "react-router-dom"

import { Header } from "@/components/dashboard/Header/Header"
import { DashboardOverlays } from "./components/DashboardOverlays"
import { SectionsNav } from "./components/SectionsNav"

import { useDashboardSearchMeta } from "./hooks/useDashboardSearchMeta"
import { useDashboardUI } from "./hooks/useDashboardUI"
import { useAppSelector } from "@/app/hooks"

import { useGetAdminProductsQuery } from "@/api"

const DashboardLayout = () => {
  const location = useLocation()

  const { user, token } = useAppSelector((s) => s.auth)

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

    handleEditProduct,

    getPlaceholder,
  } = useDashboardUI()

  // 🔥 ПОЛУЧАЕМ ПРОДУКТЫ
  const { data: productsData } = useGetAdminProductsQuery()
  const products = productsData?.data || []

  const {
    section,
    searchValue,
    searchMeta,
    searchPlaceholder,
    setSearchMeta,
    handleSearchChange,
  } = useDashboardSearchMeta({
    pathname: location.pathname,
    searchQueries,
    setSearchQuery,
    getPlaceholder,
  })

  /* ===============================
     AUTH GUARD
  =============================== */

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-slate-50 w-full">

      <Header
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        userName={user.name}
        searchValue={searchValue}
        searchPlaceholder={searchPlaceholder}
        searchEnabled={Boolean(section)}
        onSearchChange={handleSearchChange}
        searchMeta={searchMeta}
      />

      <div className="w-full max-w-7xl mx-auto px-4 py-4 min-w-0">

        <SectionsNav />

        <main className="mt-6 w-full min-w-0">
          <Outlet
            context={{
              products,
              handleEditProduct,
              setShowAddProductModal,
              searchQuery: searchValue,
              setSearchMeta,
            }}
          />
        </main>

      </div>

      <DashboardOverlays
        products={products}
        orderDetailsModal={orderDetailsModal}
        showAddProductModal={showAddProductModal}
        showEditProductModal={showEditProductModal}
        selectedProduct={selectedProduct}
        onCloseOrderDetails={() =>
          setOrderDetailsModal({
            isOpen: false,
            order: null,
          })
        }
        onCloseAddProduct={() => setShowAddProductModal(false)}
        onCloseEditProduct={() => setShowEditProductModal(false)}
      />

    </div>
  )
}

export default DashboardLayout