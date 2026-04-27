import { useMemo } from "react"
import {
  useGetPublicCategoriesQuery,
  useGetPublicProductsQuery,
} from "@/api"
import type { Category, Product } from "@/types"

const getValidCategories = (categories: Category[]) => {
  return categories.filter((category) => {
    return (
      category.id !== undefined &&
      category.id !== null &&
      category.name !== "Без категории"
    )
  })
}

const groupProductsByCategory = (
  products: Product[],
  categories: Category[]
): Record<number, Product[]> => {
  const grouped: Record<number, Product[]> = {}

  categories.forEach((category) => {
    if (category.id) {
      grouped[category.id] = []
    }
  })

  products.forEach((product) => {
    if (!product.categories?.length) return

    product.categories.forEach((category) => {
      if (category.id && !grouped[category.id]) {
        grouped[category.id] = []
      }

      if (category.id) {
        grouped[category.id].push(product)
      }
    })
  })

  Object.keys(grouped).forEach((id) => {
    const numericId = Number(id)

    if (grouped[numericId] && Array.isArray(grouped[numericId])) {
      grouped[numericId].sort((left, right) => {
        return (left.menu_order || 0) - (right.menu_order || 0)
      })
    }
  })

  return grouped
}

export const useHomeCatalogData = () => {
  const {
    data,
    isLoading: productsLoading,
    isError: productsError,
  } = useGetPublicProductsQuery()

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetPublicCategoriesQuery()

  const products: Product[] = useMemo(() => data?.data ?? [], [data?.data])

  const categories = useMemo<Category[]>(() => {
    return Array.isArray(categoriesData) ? categoriesData : []
  }, [categoriesData])

  const validCategories = useMemo(
    () => getValidCategories(categories),
    [categories]
  )

  const productsByCategory = useMemo(() => {
    return groupProductsByCategory(products, validCategories)
  }, [products, validCategories])

  return {
    categories: validCategories,
    products,
    productsByCategory,

    productsLoading,
    productsError,
    categoriesLoading,
    categoriesError,
  }
}
