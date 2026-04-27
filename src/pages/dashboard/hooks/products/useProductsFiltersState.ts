import { useState } from "react"
import type { ProductStatusFilter } from "./types"

export const useProductsFiltersState = () => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState<number | null>(null)

  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<ProductStatusFilter>("all")

  return {
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedStatusFilter,
    setSelectedStatusFilter,
  }
}
