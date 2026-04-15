/* =========================
   IMAGE PREVIEW
========================= */

import type { Tag } from "@/types"

export interface ImagePreview {
  file: File
  preview: string
  id: string
}


/* =========================
   CATEGORY
========================= */

export interface ProductCategory {
  id: number
  name: string
}


/* =========================
   PRODUCT FORM STATE
========================= */

export interface AddProductFormState {
  name: string
  description: string

  regularPrice: string
  salePrice: string

  weight: string

  selectedCategory: number | null
}


/* =========================
   ADD PRODUCT MODAL PROPS
========================= */

export interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
}


/* =========================
   USE ADD PRODUCT HOOK PROPS
========================= */

export interface UseAddProductProps {
  onClose: () => void
}


/* =========================
   USE ADD PRODUCT RETURN
========================= */

export interface UseAddProductReturn {

  fileInputRef: React.RefObject<HTMLInputElement>

  categories?: ProductCategory[]
  tags?: Tag[]

  images: ImagePreview[]

  name: string
  setName: (value: string) => void

  description: string
  setDescription: (value: string) => void

  regularPrice: string
  setRegularPrice: (value: string) => void

  salePrice: string
  setSalePrice: (value: string) => void

  weight: string
  setWeight: (value: string) => void

  selectedCategory: number | null
  setSelectedCategory: (value: number) => void

  topTagId: number | null
  setTopTagId: (value: number | null) => void

  bottomTagIds: number[]
  setBottomTagIds: React.Dispatch<React.SetStateAction<number[]>>

  isSubmitting: boolean

  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeImage: (id: string) => void

  handleSubmit: (description?: string) => void
  handleClose: () => void
}