import { useState, useMemo } from "react"

import {
  useGetAdminProductsQuery,
  useGetAdminCategoriesQuery,
} from "@/api"

import type { Product } from "@/types"

/* =========================
   PRODUCTS HOOK
   Управление товарами в админ панели
   Включает фильтрацию, сортировку по порядку и перетаскивание
========================= */

export const useProducts = (searchQuery: string) => {

  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState<number | null>(null)

  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<"all" | "publish" | "draft">("all")

  const [draggedProductId, setDraggedProductId] =
    useState<number | null>(null)

  const { data: categoriesData } =
    useGetAdminCategoriesQuery()

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError
  } = useGetAdminProductsQuery()

  const categories = Array.isArray(categoriesData) ? categoriesData : []

  const allProducts: Product[] =
    productsData?.data || []

  /* ===============================
     FILTER
  =============================== */

  const products = useMemo(() => {

    let filtered = allProducts

    const query = searchQuery.toLowerCase()

    if (query) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query)
      )
    }

    if (selectedStatusFilter !== "all") {
      filtered = filtered.filter(
        p => p.status === selectedStatusFilter
      )
    }

    if (selectedCategoryFilter) {
      filtered = filtered.filter((product) =>
        product.categories?.some(
          cat => cat.id === selectedCategoryFilter
        )
      )
    }

    return filtered

  }, [
    allProducts,
    searchQuery,
    selectedStatusFilter,
    selectedCategoryFilter
  ])

  /* ===============================
     SORT
  =============================== */

  const sortedProducts = useMemo(() => {

    return [...products].sort((a, b) => {
      const orderA = a.menu_order || 0
      const orderB = b.menu_order || 0
      return orderA - orderB
    })

  }, [products])

  /* ===============================
     DRAG
  =============================== */

  const handleDragStart = (
    e: React.DragEvent,
    productId: number
  ) => {

    setDraggedProductId(productId)
    e.dataTransfer.effectAllowed = "move"

  }

  const handleDragOver = (e: React.DragEvent) => {

    e.preventDefault()
    e.dataTransfer.dropEffect = "move"

  }

  const handleDrop = async (
    e: React.DragEvent,
    targetProductId: number
  ) => {

    e.preventDefault()

    if (!draggedProductId || draggedProductId === targetProductId)
      return

    const draggedIndex =
      sortedProducts.findIndex(p => p.id === draggedProductId)

    const targetIndex =
      sortedProducts.findIndex(p => p.id === targetProductId)

    if (draggedIndex === -1 || targetIndex === -1)
      return

    const newOrder = [...sortedProducts]

    const [removed] = newOrder.splice(draggedIndex, 1)
    newOrder.splice(targetIndex, 0, removed)

    try {

      const updates = newOrder
        .map((product, index) => ({
          id: product.id,
          newOrder: index + 1,
          oldOrder: product.menu_order || 0
        }))
        .filter(p => p.newOrder !== p.oldOrder)

      // TODO: Add API endpoint for updating product order
      // await Promise.all(
      //   updates.map(p =>
      //     updateProductOrder({
      //       id: p.id,
      //       menu_order: p.newOrder
      //     }).unwrap()
      //   )
      // )

      console.log("Product order would be updated:", updates)

    } catch (error) {

      console.error("Ошибка обновления порядка", error)

    } finally {
      setDraggedProductId(null)
    }

  }

  return {

    products,
    sortedProducts,
    productsLoading,
    productsError,

    categories,

    selectedCategoryFilter,
    setSelectedCategoryFilter,

    selectedStatusFilter,
    setSelectedStatusFilter,

    draggedProductId,

    handleDragStart,
    handleDragOver,
    handleDrop

  }
}