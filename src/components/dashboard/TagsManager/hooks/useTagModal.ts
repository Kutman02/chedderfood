import { useCallback, useState } from "react"
import type { Tag } from "@/types"

export const useTagModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedTag, setSelectedTag] = useState<Tag | undefined>()

  const handleOpenCreate = useCallback(() => {
    setIsEdit(false)
    setSelectedTag(undefined)
    setIsOpen(true)
  }, [])

  const handleOpenEdit = useCallback((tag: Tag) => {
    setIsEdit(true)
    setSelectedTag(tag)
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setIsEdit(false)
    setSelectedTag(undefined)
  }, [])

  return {
    isOpen,
    isEdit,
    selectedTag,
    handleOpenCreate,
    handleOpenEdit,
    handleClose,
  }
}