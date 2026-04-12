import { useCallback, useState } from "react"
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/api"
import type { Category } from "@/types"
import type { CategoryFormData } from "../types/categories.types"

interface UseCategoryActionsOptions {
  onSuccess?: () => void
}

export const useCategoryActions = (
  options?: UseCategoryActionsOptions
) => {
  const [createMutation] = useCreateCategoryMutation()
  const [updateMutation] = useUpdateCategoryMutation()
  const [deleteMutation] = useDeleteCategoryMutation()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = useCallback(
    async (data: CategoryFormData) => {
      setIsSubmitting(true)
      try {
        await createMutation(data).unwrap()
        options?.onSuccess?.()
      } catch (error) {
        console.error("Error creating category:", error)
        throw error
      } finally {
        setIsSubmitting(false)
      }
    },
    [createMutation, options]
  )

  const handleUpdate = useCallback(
    async (id: number, data: CategoryFormData) => {
      setIsSubmitting(true)
      try {
        await updateMutation({ id, data }).unwrap()
        options?.onSuccess?.()
      } catch (error) {
        console.error("Error updating category:", error)
        throw error
      } finally {
        setIsSubmitting(false)
      }
    },
    [updateMutation, options]
  )

  const handleDelete = useCallback(
    async (id: number) => {
      setIsSubmitting(true)
      try {
        await deleteMutation(id).unwrap()
        options?.onSuccess?.()
      } catch (error) {
        console.error("Error deleting category:", error)
        throw error
      } finally {
        setIsSubmitting(false)
      }
    },
    [deleteMutation, options]
  )

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    isSubmitting,
  }
}
