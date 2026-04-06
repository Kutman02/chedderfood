import { useState } from "react"

import type { OrderStatus, Product } from "@/types"

type SearchSection = "orders" | "products" | "customers"

export const useDashboardUI = () => {

  /* ===============================
     ACTIVE TAB (строго типизирован)
  =============================== */

  const [activeTab, setActiveTab] =
    useState<OrderStatus>("on-hold")

  /* ===============================
     SEARCH
  =============================== */

  const [searchQueries, setSearchQueries] = useState({
    orders: "",
    products: "",
    customers: ""
  })

  const setSearchQuery = (
    section: SearchSection,
    value: string
  ) => {
    setSearchQueries(prev => ({
      ...prev,
      [section]: value
    }))
  }

  /* ===============================
     UI STATES
  =============================== */

  const [showStats, setShowStats] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [showEditProductModal, setShowEditProductModal] = useState(false)

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null)

  /* ===============================
     ORDER MODAL (🔥 RAW BACKEND)
  =============================== */

  const [orderDetailsModal, setOrderDetailsModal] = useState<{
    isOpen: boolean
    order: any | null // 🔥 RAW DATA (ВАЖНО)
  }>({
    isOpen: false,
    order: null
  })

  /* ===============================
     HANDLERS
  =============================== */

  const handleViewDetails = (order: any) => {
    setOrderDetailsModal({
      isOpen: true,
      order
    })
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setShowEditProductModal(true)
  }

  /* ===============================
     PLACEHOLDER
  =============================== */

  const getPlaceholder = (section: SearchSection) => {
    switch (section) {
      case "orders":
        return "Поиск заказа по имени, телефону или адресу..."

      case "products":
        return "Поиск товара..."

      case "customers":
        return "Поиск клиента..."

      default:
        return "Поиск..."
    }
  }

  /* ===============================
     RETURN
  =============================== */

  return {
    activeTab,
    setActiveTab,

    searchQueries,
    setSearchQuery,

    showStats,
    setShowStats,

    showSettings,
    setShowSettings,

    showAddProductModal,
    setShowAddProductModal,

    showEditProductModal,
    setShowEditProductModal,

    selectedProduct,
    setSelectedProduct,

    orderDetailsModal,
    setOrderDetailsModal,

    handleViewDetails,
    handleEditProduct,

    getPlaceholder
  }
}