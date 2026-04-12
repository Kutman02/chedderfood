import { useState, useCallback } from "react"
import type { Category } from "@/types"

export const useCategoryModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>()

  const handleOpenCreate = useCallback(() => {
    setIsEdit(false)
    setSelectedCategory(undefined)
    setIsOpen(true)
  }, [])

  const handleOpenEdit = useCallback((category: Category) => {
    setIsEdit(true)
    setSelectedCategory(category)
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setIsEdit(false)
    setSelectedCategory(undefined)
  }, [])

  return {
    isOpen,
    isEdit,
    selectedCategory,
    handleOpenCreate,
    handleOpenEdit,
    handleClose,
  }
}
