import { useState } from "react"
import type { DragEvent } from "react"
import type { Product } from "@/types"

type UseProductsDragArgs = {
  sortedProducts: Product[]
}

export const useProductsDrag = ({
  sortedProducts,
}: UseProductsDragArgs) => {
  const [draggedProductId, setDraggedProductId] =
    useState<number | null>(null)

  const handleDragStart = (
    event: DragEvent,
    productId: number
  ) => {
    setDraggedProductId(productId)
    event.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (
    event: DragEvent,
    targetProductId: number
  ) => {
    event.preventDefault()

    if (!draggedProductId || draggedProductId === targetProductId) {
      return
    }

    const draggedIndex =
      sortedProducts.findIndex((product) => product.id === draggedProductId)

    const targetIndex =
      sortedProducts.findIndex((product) => product.id === targetProductId)

    if (draggedIndex === -1 || targetIndex === -1) {
      return
    }

    const newOrder = [...sortedProducts]

    const [removed] = newOrder.splice(draggedIndex, 1)
    newOrder.splice(targetIndex, 0, removed)

    try {
      const updates = newOrder
        .map((product, index) => ({
          id: product.id,
          newOrder: index + 1,
          oldOrder: product.menu_order || 0,
        }))
        .filter((product) => product.newOrder !== product.oldOrder)

      // TODO: add API endpoint for updating product order.
      console.log("Product order would be updated:", updates)
    } catch (error) {
      console.error("Ошибка обновления порядка", error)
    } finally {
      setDraggedProductId(null)
    }
  }

  return {
    draggedProductId,
    handleDragStart,
    handleDragOver,
    handleDrop,
  }
}
