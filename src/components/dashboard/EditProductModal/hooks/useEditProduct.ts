import { useState, useEffect, useRef } from "react"

import {
  useGetProductCategoriesQuery,
  useGetTagsQuery,
  useUpdateProductMutation,
  useUploadImageMutation
} from "@/api"
import type { ProductImage, Tag } from "@/types"
import { getSaleTagId, isSaleTag, isTopPlacementTag } from "@/shared/utils/tagPlacement"
import type { ImagePreview, UseEditProductProps } from "../types/editProduct.types"

export const useEditProduct = ({
  product,
  onClose,
  isOpen
}: UseEditProductProps) => {

  const [images, setImages] = useState<ImagePreview[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [topTagId, setTopTagId] = useState<number | null>(null)
  const [bottomTagIds, setBottomTagIds] = useState<number[]>([])

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const [regularPrice, setRegularPrice] = useState("")
  const [salePrice, setSalePrice] = useState("")

  const [isHidden, setIsHidden] = useState(false)

  const [weight, setWeight] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // 🔥 FIX — без параметров
  const { data: categories } =
    useGetProductCategoriesQuery()
  const { data: tags } = useGetTagsQuery()

  const [updateProduct] = useUpdateProductMutation()
  const [uploadImage] = useUploadImageMutation()

  const stripHtmlTags = (html: string) => {
    if (!html) return ""
    const tmp = document.createElement("div")
    tmp.innerHTML = html
    return tmp.textContent || ""
  }

  useEffect(() => {

    if (!product || !isOpen) return

    setName(product.name || "")
    setDescription(stripHtmlTags(product.description || ""))

    setRegularPrice(product.regular_price || product.price || "")
    setSalePrice(product.sale_price || "")

    setSelectedCategory(product.categories?.[0]?.id || null)

    const existingTags = product.tags ?? []
    const selectedTop = existingTags.find((tag) => isTopPlacementTag(tag) && !isSaleTag(tag))

    setTopTagId(selectedTop?.id ?? null)
    setBottomTagIds(
      existingTags
        .filter((tag) => tag.id !== selectedTop?.id)
        .map((tag) => tag.id)
    )

    setWeight(product.weight?.toString() || "")

    setIsHidden(product.status === "draft")

    if (product.images) {
      setImages(
        product.images.map((img: ProductImage) => ({
          preview: img.src,
          id: img.id?.toString() || crypto.randomUUID(),
          imageId: img.id,
        }))
      )
    }

  }, [product, isOpen])

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

      if (image?.file) {
        URL.revokeObjectURL(image.preview)
      }

      return prev.filter(img => img.id !== id)

    })
  }

  /* ===============================
     UPLOAD IMAGES (🔥 FIX)
  =============================== */

  const uploadImages = async () => {

    const imageIds: number[] = []

    for (const img of images) {

      if (img.imageId) {
        imageIds.push(img.imageId)
        continue
      }

      if (!img.file) continue

      const res = await uploadImage({ file: img.file }).unwrap() as { id: number }

      if (res?.id) {
        imageIds.push(res.id)
      }
    }

    return imageIds
  }

  /* ===============================
     SUBMIT (🔥 ГЛАВНЫЙ ФИКС)
  =============================== */

  const handleSubmit = async (customDescription?: string) => {

    if (!product) return

    if (!name || !selectedCategory || !regularPrice) {
      alert("Заполните обязательные поля")
      return
    }

    if (images.length === 0) {
      alert("Добавьте хотя бы одно фото товара")
      return
    }

    setIsSubmitting(true)

    try {

      const imageIds = await uploadImages()

      const finalDescription = customDescription ?? description

      const saleTagId = getSaleTagId(tags as Tag[])
      const shouldApplySaleTag = Boolean(salePrice)

      const mergedTagIds = Array.from(
        new Set([
          ...(topTagId ? [topTagId] : []),
          ...bottomTagIds,
          ...(shouldApplySaleTag && saleTagId ? [saleTagId] : []),
        ])
      )

      await updateProduct({
        id: product.id,
        data: {
          name,
          price: Number(salePrice || regularPrice),
          regular_price: Number(regularPrice),
          sale_price: salePrice ? Number(salePrice) : undefined,
          description: finalDescription,
          category_ids: selectedCategory ? [selectedCategory] : [],
          tag_ids: mergedTagIds,
          image_ids: imageIds,
          visible: !isHidden,
        }
      }).unwrap()

      onClose()

    } catch (error) {

      console.error("Update product error:", error)
      alert("Ошибка обновления товара")

    } finally {

      setIsSubmitting(false)

    }
  }

  const handleClose = () => {

    images.forEach(img => {
      if (img.file) URL.revokeObjectURL(img.preview)
    })

    onClose()
  }

  return {

    categories,
    tags,

    images,
    setImages,

    fileInputRef,

    name,
    setName,

    description,
    setDescription,

    regularPrice,
    setRegularPrice,

    salePrice,
    setSalePrice,

    selectedCategory,
    setSelectedCategory,

    topTagId,
    setTopTagId,

    bottomTagIds,
    setBottomTagIds,

    isHidden,
    setIsHidden,

    weight,
    setWeight,

    isSubmitting,

    handleImageSelect,
    removeImage,

    handleSubmit,
    handleClose
  }
}
