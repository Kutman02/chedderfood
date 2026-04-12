import type { Category } from "@/types"

export interface CategoryFormData {
  name: string
  slug?: string
  description?: string
}

export interface CategoryFormProps {
  onSubmit: (data: CategoryFormData) => void
  isSubmitting: boolean
  initialData?: Category
  submitButtonText?: string
}

export interface CategoriesListProps {
  categories: Category[]
  isLoading: boolean
  error?: string
  onEdit: (category: Category) => void
  onDelete: (id: number) => void
  onAdd: () => void
}

export interface CategoryModalProps {
  isOpen: boolean
  isEdit: boolean
  category?: Category
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (data: CategoryFormData) => void
}
