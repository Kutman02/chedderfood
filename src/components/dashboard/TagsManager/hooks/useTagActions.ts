import { useCallback, useState } from "react"
import {
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} from "@/api"
import type { TagFormData } from "../types/tags.types"

interface UseTagActionsOptions {
  onSuccess?: () => void
}

export const useTagActions = (options?: UseTagActionsOptions) => {
  const [createMutation] = useCreateTagMutation()
  const [updateMutation] = useUpdateTagMutation()
  const [deleteMutation] = useDeleteTagMutation()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = useCallback(
    async (data: TagFormData) => {
      setIsSubmitting(true)
      try {
        await createMutation(data).unwrap()
        options?.onSuccess?.()
      } finally {
        setIsSubmitting(false)
      }
    },
    [createMutation, options]
  )

  const handleUpdate = useCallback(
    async (id: number, data: TagFormData) => {
      setIsSubmitting(true)
      try {
        await updateMutation({ id, data }).unwrap()
        options?.onSuccess?.()
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