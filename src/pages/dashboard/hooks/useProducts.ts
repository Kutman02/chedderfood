import { useState, useMemo } from "react"

import {
  useGetProductsQuery,
  useGetProductCategoriesQuery,
  useUpdateProductOrderMutation
} from "@/api"

import type { Product } from "@/types"

export const useProducts = (searchQuery: string) => {

  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState<number | null>(null)

  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<"all" | "publish" | "draft">("all")

  const [draggedProductId, setDraggedProductId] =
    useState<number | null>(null)

  const [updateProductOrder] =
    useUpdateProductOrderMutation()

  // 🔥 FIX 1 — убрали params
  const { data: categories } =
    useGetProductCategoriesQuery()

  // 🔥 FIX 2 — убрали params
  const {
    data: productsData,
    isLoading: productsLoading
  } = useGetProductsQuery()

  const allProducts: Product[] = productsData || []

  // 🔥 поиск + фильтр теперь на фронте
  const products = useMemo(() => {

    let filtered = allProducts

    // 🔍 поиск
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 📦 статус
    if (selectedStatusFilter !== "all") {
      filtered = filtered.filter(
        p => p.status === selectedStatusFilter
      )
    }

    // 📂 категория
    if (selectedCategoryFilter) {
      filtered = filtered.filter((product) =>
        product.categories?.some(
          cat => cat.id === selectedCategoryFilter
        )
      )
    }

    return filtered

  }, [allProducts, searchQuery, selectedStatusFilter, selectedCategoryFilter])

  const sortedProducts = useMemo(() => {

    return [...products].sort((a, b) => {
      const orderA = a.menu_order || 0
      const orderB = b.menu_order || 0
      return orderA - orderB
    })

  }, [products])

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

      await Promise.all(
        updates.map(p =>
          updateProductOrder({
            id: p.id,
            menu_order: p.newOrder
          }).unwrap()
        )
      )

    } catch (error) {

      console.error("Ошибка обновления порядка", error)

    }

    setDraggedProductId(null)

  }

  return {

    products,
    sortedProducts,
    productsLoading,

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