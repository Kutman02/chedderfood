import type {
  CategoriesResponse,
  Category,
  CategoryMutationResponse,
} from "@/types"

export const normalizeCategoriesResponse = (
  response: CategoriesResponse
): Category[] => response.data ?? []

export const normalizeCategoryMutationResponse = (
  response: CategoryMutationResponse
): Category => response.data
