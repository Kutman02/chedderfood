import { useState } from "react"
import type { Order, Product } from "../../../types"

type SearchSection = "orders" | "products" | "customers"

export const useDashboardUI = () => {

  const [activeTab, setActiveTab] = useState("on-hold")

  const [searchQueries, setSearchQueries] = useState({
    orders: "",
    products: "",
    customers: ""
  })

  const setSearchQuery = (section: SearchSection, value: string) => {
    setSearchQueries(prev => ({
      ...prev,
      [section]: value
    }))
  }

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

  const handleViewDetails = (order: Order) => {
    setOrderDetailsModal({
      isOpen: true,
      order
    })
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setShowEditProductModal(true)
  }

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
