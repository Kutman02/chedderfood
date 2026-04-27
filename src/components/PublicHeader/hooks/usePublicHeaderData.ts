import { useMemo } from "react"
import { useGetPublicCategoriesQuery } from "@/api"
import { useAppSelector } from "@/app/hooks"
import type { Category } from "@/types"

export const usePublicHeaderData = () => {
  const receipts = useAppSelector((s) => s.receipts.receipts)

  const { data: categories, isLoading, isError } =
    useGetPublicCategoriesQuery()

  const hasActiveOrders = useMemo(() => {
    return receipts.some(
      (receipt) =>
        receipt.status !== "completed" && receipt.status !== "cancelled"
    )
  }, [receipts])

  const filteredCategories = useMemo<Category[]>(() => {
    if (!Array.isArray(categories)) return []

    return categories.filter(
      (category) =>
        category.id !== undefined &&
        category.id !== null &&
        category.name !== "Без категории"
    )
  }, [categories])

  return {
    hasActiveOrders,
    filteredCategories,
    isLoading,
    isError,
  }
}
