import {
  ProductsFilters,
} from "./products/ProductsFilters"
import { ProductsGrid } from "./products/ProductsGrid"

import type { Product } from "@/types"
import type { ProductStatusFilter } from "../hooks/products/types"

type Category = {
  id: number
  name: string
}

type Props = {
  products: Product[]
  sortedProducts: Product[]

  categories?: Category[]

  selectedCategoryFilter: number | null
  setSelectedCategoryFilter: (id: number | null) => void

  selectedStatusFilter: ProductStatusFilter
  setSelectedStatusFilter: (v: ProductStatusFilter) => void

  onAddProduct: () => void
  onEditProduct: (product: Product) => void

  draggedProductId: number | null

  onDragStart: (e: React.DragEvent, id: number) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, id: number) => void
}

export const ProductsSection = ({
  sortedProducts = [],
  categories = [],

  selectedCategoryFilter,
  setSelectedCategoryFilter,

  selectedStatusFilter,
  setSelectedStatusFilter,

  onAddProduct,
  onEditProduct,

  draggedProductId,

  onDragStart,
  onDragOver,
  onDrop

}: Props) => {
  return (
    <>
      <ProductsFilters
        categories={categories}
        selectedCategoryFilter={selectedCategoryFilter}
        setSelectedCategoryFilter={setSelectedCategoryFilter}
        selectedStatusFilter={selectedStatusFilter}
        setSelectedStatusFilter={setSelectedStatusFilter}
        onAddProduct={onAddProduct}
      />

      <ProductsGrid
        sortedProducts={sortedProducts}
        draggedProductId={draggedProductId}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onEditProduct={onEditProduct}
      />
    </>
  )
}