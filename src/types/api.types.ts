export type CreateProductPayload = {
  name: string
  price: string
  category_id: number
  description: string
  images: string[]
  weight?: string
}
export type UpdateProductPayload = {
  id: number
  name: string
  price: string
  category_id: number
  description: string
  images: string[]
  weight?: string
  status?: "publish" | "draft"
}