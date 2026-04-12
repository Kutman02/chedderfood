export interface Category {
  id: number
  name: string
  slug?: string
  description?: string
}

export interface CategoriesResponse {
  success: boolean
  data: Category[]
  total?: number
}

export interface CreateCategoryRequest {
  name: string
  slug?: string
  description?: string
}

export interface UpdateCategoryRequest {
  name?: string
  slug?: string
  description?: string
}

export interface CategoryMutationResponse {
  success: boolean
  data: Category
  message?: string
}

export interface CategoryDeleteResponse {
  success: boolean
  data: {
    message: string
    id: number
  }
}
