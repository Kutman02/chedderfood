import { Outlet, useLocation, Navigate } from "react-router-dom"

import { Header } from "@/components/dashboard/Header/Header"
import { SectionsNav } from "./components/SectionsNav"
import { SearchBar } from "./components/SearchBar"

import { useDashboardUI } from "./hooks/useDashboardUI"
import { useAppSelector } from "@/app/hooks"

import { OrderDetailsModal } from "@/components/dashboard/OrderDetailsModal/OrderDetailsModal"
import { AddProductModal } from "@/components/dashboard/AddProductModal/AddProductModal"
import { EditProductModal } from "@/components/dashboard/EditProductModal/EditProductModal"

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

  /* ===============================
     AUTH GUARD
  =============================== */

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  /* ===============================
     SECTION
  =============================== */

  const section =
    location.pathname.includes("/products")
      ? "products"
      : location.pathname.includes("/tags")
      ? "tags"
      : location.pathname.includes("/categories")
      ? "categories"
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
              products: productsData?.data || [],
              handleEditProduct,
              setShowAddProductModal,
              searchQuery: searchQueries[section],
            }}
          />
        </main>

      </div>

      {/* 🔥 ВАЖНО: передаем products */}
      <OrderDetailsModal
        isOpen={orderDetailsModal.isOpen}
        order={orderDetailsModal.order}
        products={productsData?.data || []}
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