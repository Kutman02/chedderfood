import { useMemo } from "react"

import {
  useGetAdminCategoriesQuery,
  useGetAdminProductsQuery,
} from "@/api"
import type { Product } from "@/types"
import type { ProductStatusFilter } from "./types"

type UseProductsDataArgs = {
  searchQuery: string
  selectedStatusFilter: ProductStatusFilter
  selectedCategoryFilter: number | null
}

export const useProductsData = ({
  searchQuery,
  selectedStatusFilter,
  selectedCategoryFilter,
}: UseProductsDataArgs) => {
  const { data: categoriesData } = useGetAdminCategoriesQuery()

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
  } = useGetAdminProductsQuery()

  const categories = Array.isArray(categoriesData) ? categoriesData : []

  const allProducts: Product[] = productsData?.data || []

  const products = useMemo(() => {
    let filtered = allProducts

    const query = searchQuery.toLowerCase()

    if (query) {
      filtered = filtered.filter((product) => {
        return product.name.toLowerCase().includes(query)
      })
    }

    if (selectedStatusFilter !== "all") {
      filtered = filtered.filter((product) => {
        return product.status === selectedStatusFilter
      })
    }

    if (selectedCategoryFilter) {
      filtered = filtered.filter((product) => {
        return product.categories?.some((category) => {
          return category.id === selectedCategoryFilter
        })
      })
    }

    return filtered
  }, [allProducts, searchQuery, selectedCategoryFilter, selectedStatusFilter])

  const sortedProducts = useMemo(() => {
    return [...products].sort((left, right) => {
      const orderLeft = left.menu_order || 0
      const orderRight = right.menu_order || 0
      return orderLeft - orderRight
    })
  }, [products])

  return {
    categories,
    products,
    sortedProducts,
    totalProducts: allProducts.length,
    productsLoading,
    productsError,
  }
}
