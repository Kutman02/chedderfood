import type { Product } from "@/types"
import type { RefObject } from "react"

export type ProductTagStatus = "hit" | "new" | "sale" | "none"

/* =========================
   MODAL PROPS
========================= */

export interface EditProductModalProps {
  isOpen: boolean
  product: Product | null
  onClose: () => void
}


/* =========================
   IMAGE PREVIEW
========================= */

export interface ImagePreview {
  file?: File
  preview: string
  id: string
  imageId?: number
}


/* =========================
   HOOK PROPS
========================= */

export interface UseEditProductProps {
  product: Product | null
  onClose: () => void
  isOpen: boolean
}


/* =========================
   HOOK RETURN
========================= */

export interface UseEditProductReturn {

  fileInputRef: RefObject<HTMLInputElement | null>

  categories?: {
    id: number
    name: string
  }[]

  images: ImagePreview[]
  setImages: React.Dispatch<React.SetStateAction<ImagePreview[]>>

  name: string
  setName: (value: string) => void

  description: string
  setDescription: (value: string) => void

  regularPrice: string
  setRegularPrice: (value: string) => void

  salePrice: string
  setSalePrice: (value: string) => void

  selectedCategory: number | null
  setSelectedCategory: (value: number) => void

  productStatus: ProductTagStatus
  setProductStatus: (value: ProductTagStatus) => void

  isHidden: boolean
  setIsHidden: (value: boolean) => void

  weight: string
  setWeight: (value: string) => void

  isSubmitting: boolean

  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeImage: (id: string) => void

  handleSubmit: (description?: string) => Promise<void>
  handleClose: () => void
}
