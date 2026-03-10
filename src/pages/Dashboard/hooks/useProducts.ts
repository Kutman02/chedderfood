import { useState, useMemo } from "react"

import {
  useGetProductsQuery,
  useGetProductCategoriesQuery,
  useUpdateProductOrderMutation
} from "../../../app/services/api"

import type { Product } from "../../../types"

export const useProducts = (
  mainSection: string,
  searchQuery: string
) => {

  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState<number | null>(null)

  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<"all" | "publish" | "draft">("all")

  const [draggedProductId, setDraggedProductId] =
    useState<number | null>(null)

  const [updateProductOrder] =
    useUpdateProductOrderMutation()

  const { data: categories } =
    useGetProductCategoriesQuery(
      { per_page: 100 },
      { skip: mainSection !== "products" }
    )

  const {
    data: productsData,
    isLoading: productsLoading
  } = useGetProductsQuery(
    {
      search: searchQuery,
      per_page: 100,
      status: selectedStatusFilter === "all"
        ? undefined
        : selectedStatusFilter
    },
    { skip: mainSection !== "products" }
  )

  const products = useMemo(() => {

    const allProducts = productsData || []

    if (!selectedCategoryFilter) return allProducts

    return allProducts.filter((product: Product) =>
      product.categories?.some(
        cat => cat.id === selectedCategoryFilter
      )
    )

  }, [productsData, selectedCategoryFilter])

  const sortedProducts = useMemo(() => {

    return [...products].sort((a,b) => {
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

    const [removed] = newOrder.splice(draggedIndex,1)

    newOrder.splice(targetIndex,0,removed)

    try {

      for (let i = 0; i < newOrder.length; i++) {

        await updateProductOrder({
          id: newOrder[i].id,
          menu_order: i + 1
        }).unwrap()

      }

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