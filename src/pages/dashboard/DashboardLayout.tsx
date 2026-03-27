import { Outlet, useLocation, Navigate } from "react-router-dom"

import { Header } from "@/components/dashboard/Header/Header"
import { SectionsNav } from "./components/SectionsNav"
import { SearchBar } from "./components/SearchBar"

import { useDashboardUI } from "./hooks/useDashboardUI"
import { useAppSelector } from "@/app/hooks"

import { OrderDetailsModal } from "@/components/dashboard/OrderDetailsModal/OrderDetailsModal"
import { AddProductModal } from "@/components/dashboard/AddProductModal/AddProductModal"
import { EditProductModal } from "@/components/dashboard/EditProductModal/EditProductModal"

const DashboardLayout = () => {
  const location = useLocation()

  // 🔥 новый источник правды
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

    handleViewDetails,
    handleEditProduct,

    getPlaceholder,
  } = useDashboardUI()

  // 🔐 защита
  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  const section =
    location.pathname.includes("/products")
      ? "products"
      : location.pathname.includes("/customers")
      ? "customers"
      : "orders"

  return (
    <div className="min-h-screen bg-slate-50 w-full">

      <Header
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        userName={user.name}
      />

      <div className="w-full max-w-7xl mx-auto px-4 py-4 min-w-0">

        <SectionsNav />

        <SearchBar
          value={searchQueries[section]}
          onChange={(v) => setSearchQuery(section, v)}
          placeholder={getPlaceholder(section)}
        />

        <main className="mt-6 w-full min-w-0">
          <Outlet
            context={{
              handleViewDetails,
              handleEditProduct,
              setShowAddProductModal,
              searchQuery: searchQueries[section],
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
            order: null,
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