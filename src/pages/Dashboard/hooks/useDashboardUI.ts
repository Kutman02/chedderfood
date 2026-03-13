import { useState } from "react"
import type { Order, Product } from "../../../types"

export const useDashboardUI = () => {

  const [activeTab, setActiveTab] = useState("on-hold")

  const [searchQuery, setSearchQuery] = useState("")

  const [showStats, setShowStats] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [showEditProductModal, setShowEditProductModal] = useState(false)

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null)

  const [orderDetailsModal, setOrderDetailsModal] = useState<{
    isOpen: boolean
    order: Order | null
  }>({
    isOpen: false,
    order: null
  })

  // открыть детали заказа
  const handleViewDetails = (order: Order) => {

    setOrderDetailsModal({
      isOpen: true,
      order
    })

  }

  // редактировать товар
  const handleEditProduct = (product: Product) => {

    setSelectedProduct(product)

    setShowEditProductModal(true)

  }

  // placeholder для поиска
  const getPlaceholder = (section: "orders" | "products" | "customers") => {

    switch (section) {

      case "orders":
        return "Поиск заказа..."

      case "products":
        return "Поиск товара..."

      case "customers":
        return "Поиск клиента..."

      default:
        return "Поиск..."

    }

  }

  return {

    activeTab,
    setActiveTab,

    searchQuery,
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