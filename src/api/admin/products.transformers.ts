import type {
  Category,
  CategoriesResponse,
  Product,
} from "@/types"

type ProductMutationResponse = {
  success: boolean
  data: Product
  message: string
}

export const normalizeProductMutationResponse = (
  response: ProductMutationResponse
): Product => response.data

export const normalizeProductCategoriesResponse = (
  response: CategoriesResponse
): Category[] => response.data ?? []
