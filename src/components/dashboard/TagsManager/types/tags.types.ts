import type { Tag } from "@/types"

export interface TagFormData {
  name: string
  slug?: string
  description?: string
}

export interface TagFormProps {
  onSubmit: (data: TagFormData) => void
  isSubmitting: boolean
  initialData?: Tag
  submitButtonText?: string
}

export interface TagsListProps {
  tags: Tag[]
  isLoading: boolean
  error?: string
  onEdit: (tag: Tag) => void
  onDelete: (id: number) => void
  onAdd: () => void
}

export interface TagModalProps {
  isOpen: boolean
  isEdit: boolean
  tag?: Tag
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (data: TagFormData) => void
}