import { useHomeCartMetrics } from "./useHomeCartMetrics"
import { useHomeCatalogData } from "./useHomeCatalogData"
import { useHomeModalSync } from "./useHomeModalSync"

export const useHomeLogic = () => {
  const {
    categories,
    products,
    productsByCategory,
    productsLoading,
    productsError,
    categoriesLoading,
    categoriesError,
  } = useHomeCatalogData()

  const {
    addToCart,
    removeFromCart,
    cartCount,
    cartTotalAmount,
  } = useHomeCartMetrics()

  const {
    selectedProduct,
    isModalOpen,
    openProductModal,
    closeProductModal,
  } = useHomeModalSync({
    products,
  })

  return {
    categories,
    products,

    productsLoading,
    productsError,
    categoriesLoading,
    categoriesError,

    productsByCategory,

    addToCart,
    removeFromCart,

    cartCount,
    cartTotalAmount,

    selectedProduct,
    isModalOpen,

    openProductModal,
    closeProductModal,
  }
}
