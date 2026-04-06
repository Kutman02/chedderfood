export interface Category {
  id: number
  name: string
  slug: string
}

export interface CategoriesResponse {
  data: Category[]
  total?: number
  totalPages?: number
}