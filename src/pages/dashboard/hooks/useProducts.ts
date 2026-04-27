import { useProductsData } from "./products/useProductsData"
import { useProductsDrag } from "./products/useProductsDrag"
import { useProductsFiltersState } from "./products/useProductsFiltersState"

/* =========================
   PRODUCTS HOOK
   Управление товарами в админ панели
   Включает фильтрацию, сортировку по порядку и перетаскивание
========================= */

export const useProducts = (searchQuery: string) => {
  const filtersState = useProductsFiltersState()

  const data = useProductsData({
    searchQuery,
    selectedStatusFilter: filtersState.selectedStatusFilter,
    selectedCategoryFilter: filtersState.selectedCategoryFilter,
  })

  const dragState = useProductsDrag({
    sortedProducts: data.sortedProducts,
  })

  return {
    products: data.products,
    sortedProducts: data.sortedProducts,
    totalProducts: data.totalProducts,
    productsLoading: data.productsLoading,
    productsError: data.productsError,

    categories: data.categories,

    selectedCategoryFilter: filtersState.selectedCategoryFilter,
    setSelectedCategoryFilter: filtersState.setSelectedCategoryFilter,

    selectedStatusFilter: filtersState.selectedStatusFilter,
    setSelectedStatusFilter: filtersState.setSelectedStatusFilter,

    draggedProductId: dragState.draggedProductId,

    handleDragStart: dragState.handleDragStart,
    handleDragOver: dragState.handleDragOver,
    handleDrop: dragState.handleDrop,
  }
}