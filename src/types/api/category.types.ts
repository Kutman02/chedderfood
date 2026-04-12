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
