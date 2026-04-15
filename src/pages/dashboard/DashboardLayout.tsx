import { Outlet, useLocation, Navigate } from "react-router-dom"
import { useMemo, useState, useCallback } from "react"

import { Header } from "@/components/dashboard/Header/Header"
import { SectionsNav } from "./components/SectionsNav"

import { useDashboardUI } from "./hooks/useDashboardUI"
import { useAppSelector } from "@/app/hooks"

import { OrderDetailsModal } from "@/components/dashboard/OrderDetailsModal/OrderDetailsModal"
import { AddProductModal } from "@/components/dashboard/AddProductModal/AddProductModal"
import { EditProductModal } from "@/components/dashboard/EditProductModal/EditProductModal"

import { useGetAdminProductsQuery } from "@/api"

const DashboardLayout = () => {
  const [searchMetaBySection, setSearchMetaBySection] = useState({
    orders: { found: 0, total: 0, loading: false },
    products: { found: 0, total: 0, loading: false },
    customers: { found: 0, total: 0, loading: false },
    categories: { found: 0, total: 0, loading: false },
    tags: { found: 0, total: 0, loading: false },
  })

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
      : location.pathname.includes("/orders")
      ? "orders"
      : null

  const searchValue = section ? searchQueries[section] : ""

  const searchMeta = useMemo(() => {
    if (!section) {
      return { found: 0, total: 0, loading: false }
    }

    return searchMetaBySection[section]
  }, [searchMetaBySection, section])

  const searchPlaceholder = section
    ? getPlaceholder(section)
    : "Поиск недоступен в этом разделе"

  const setSearchMeta = useCallback(
    (
      targetSection: "orders" | "products" | "customers" | "categories" | "tags",
      nextMeta: { found: number; total: number; loading?: boolean }
    ) => {
      setSearchMetaBySection((prev) => {
        const normalizedMeta = {
          found: nextMeta.found,
          total: nextMeta.total,
          loading: nextMeta.loading ?? false,
        }

        const currentMeta = prev[targetSection]

        if (
          currentMeta.found === normalizedMeta.found &&
          currentMeta.total === normalizedMeta.total &&
          currentMeta.loading === normalizedMeta.loading
        ) {
          return prev
        }

        return {
          ...prev,
          [targetSection]: normalizedMeta,
        }
      })
    },
    []
  )

  return (
    <div className="min-h-screen bg-slate-50 w-full">

      <Header
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        userName={user.name}
        searchValue={searchValue}
        searchPlaceholder={searchPlaceholder}
        searchEnabled={Boolean(section)}
        onSearchChange={(value) => {
          if (!section) return
          setSearchQuery(section, value)
        }}
        searchMeta={searchMeta}
      />

      <div className="w-full max-w-7xl mx-auto px-4 py-4 min-w-0">

        <SectionsNav />

        <main className="mt-6 w-full min-w-0">
          <Outlet
            context={{
              products: productsData?.data || [],
              handleEditProduct,
              setShowAddProductModal,
              searchQuery: searchValue,
              setSearchMeta,
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