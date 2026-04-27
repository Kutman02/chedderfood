import type {
  CategoriesResponse,
  Category,
} from "@/types"

export const normalizePublicCategoriesResponse = (
  response: CategoriesResponse
): Category[] => response.data ?? []
