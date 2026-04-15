import { useState, useRef } from "react"

import {
  useGetProductCategoriesQuery,
  useGetTagsQuery,
  useCreateProductMutation,
  useUploadImageMutation
} from "@/api"
import type { Tag } from "@/types"
import { getSaleTagId } from "@/shared/utils/tagPlacement"

interface ImagePreview {
  file: File
  preview: string
  id: string
}

interface UseAddProductProps {
  onClose: () => void
}

export const useAddProduct = ({ onClose }: UseAddProductProps) => {

  const [images, setImages] = useState<ImagePreview[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [topTagId, setTopTagId] = useState<number | null>(null)
  const [bottomTagIds, setBottomTagIds] = useState<number[]>([])

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const [regularPrice, setRegularPrice] = useState("")
  const [salePrice, setSalePrice] = useState("")

  const [weight, setWeight] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { data: categories } = useGetProductCategoriesQuery()
  const { data: tags } = useGetTagsQuery()

  const [createProduct] = useCreateProductMutation()
  const [uploadImage] = useUploadImageMutation()

  /* ===============================
     IMAGE SELECT
  =============================== */

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {

    const files = Array.from(e.target.files || [])

    const newImages: ImagePreview[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: crypto.randomUUID()
    }))

    setImages(prev => [...prev, ...newImages])
  }

  const removeImage = (id: string) => {

    setImages(prev => {
      const image = prev.find(img => img.id === id)
      if (image) URL.revokeObjectURL(image.preview)
      return prev.filter(img => img.id !== id)
    })
  }

  /* ===============================
     VALIDATION
  =============================== */

  const validate = () => {

    if (!name.trim() || !selectedCategory || !regularPrice) {
      alert("Заполните обязательные поля")
      return false
    }

    if (images.length === 0) {
      alert("Добавьте хотя бы одно фото товара")
      return false
    }

    return true
  }

  /* ===============================
     UPLOAD IMAGES
  =============================== */

  const uploadImages = async () => {

    const imageIds: number[] = []

    for (const image of images) {

      if (!image.file) continue

      const result = await uploadImage({ file: image.file }).unwrap() as { id: number }

      if (result?.id) {
        imageIds.push(result.id)
      }
    }

    return imageIds
  }

  /* ===============================
     CREATE PRODUCT
  =============================== */

  const createNewProduct = async (
    imageIds: number[],
    customDescription?: string
  ) => {

    if (!selectedCategory) return

    const finalDescription = customDescription ?? description

    const saleTagId = getSaleTagId(tags as Tag[])
    const shouldApplySaleTag = Boolean(salePrice)

    const combinedTagIds = Array.from(
      new Set([
        ...(topTagId ? [topTagId] : []),
        ...bottomTagIds,
        ...(shouldApplySaleTag && saleTagId ? [saleTagId] : []),
      ])
    )

    await createProduct({
      name: name.trim(),
      price: Number(salePrice || regularPrice),
      regular_price: Number(regularPrice),
      sale_price: salePrice ? Number(salePrice) : undefined,
      description: finalDescription.trim(),
      category_ids: [selectedCategory],
      tag_ids: combinedTagIds,
      image_ids: imageIds,
      visible: true,
    }).unwrap()
  }

  /* ===============================
     RESET
  =============================== */

  const resetForm = () => {

    images.forEach(image => URL.revokeObjectURL(image.preview))

    setImages([])

    setName("")
    setDescription("")

    setRegularPrice("")
    setSalePrice("")

    setWeight("")

    setSelectedCategory(null)
    setTopTagId(null)
    setBottomTagIds([])
  }

  /* ===============================
     SUBMIT
  =============================== */

  const handleSubmit = async (customDescription?: string) => {

    if (!validate()) return

    setIsSubmitting(true)

    try {

      const imageIds = await uploadImages()

      await createNewProduct(imageIds, customDescription)

      resetForm()
      onClose()

    } catch (error) {

      console.error("Ошибка создания товара", error)
      alert("Ошибка при создании товара")

    } finally {

      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return {

    fileInputRef,

    categories,
    tags,

    images,

    name,
    setName,

    description,
    setDescription,

    regularPrice,
    setRegularPrice,

    salePrice,
    setSalePrice,

    weight,
    setWeight,

    selectedCategory,
    setSelectedCategory,

    topTagId,
    setTopTagId,

    bottomTagIds,
    setBottomTagIds,

    isSubmitting,

    handleImageSelect,
    removeImage,

    handleSubmit,
    handleClose
  }
}
