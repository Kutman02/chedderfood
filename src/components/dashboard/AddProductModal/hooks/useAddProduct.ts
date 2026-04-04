import { useState, useRef } from "react"

import {
  useGetProductCategoriesQuery,
  useCreateProductMutation,
  useUploadImageMutation
} from "@/api"

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

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const [regularPrice, setRegularPrice] = useState("")
  const [salePrice, setSalePrice] = useState("")

  const [weight, setWeight] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { data: categories } = useGetProductCategoriesQuery()

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

    return true
  }

  /* ===============================
     UPLOAD IMAGES
  =============================== */

  const uploadImages = async () => {

    const urls: string[] = []

    for (const image of images) {

      if (!image.file) continue

      const formData = new FormData()
      formData.append("file", image.file)

      const result = await uploadImage(formData).unwrap() as { url: string }

      if (result?.url) {
        urls.push(result.url)
      }
    }

    return urls
  }

  /* ===============================
     CREATE PRODUCT
  =============================== */

  const createNewProduct = async (
    imageUrls: string[],
    customDescription?: string
  ) => {

    if (!selectedCategory) return

    const finalDescription = customDescription ?? description

    await createProduct({

    name: name.trim(),
  price: (salePrice || regularPrice).trim(),
  category_id: selectedCategory,
  description: finalDescription.trim(),
  images: imageUrls as any, // 🔥 FIX
  weight: weight || ""

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
  }

  /* ===============================
     SUBMIT
  =============================== */

  const handleSubmit = async (customDescription?: string) => {

    if (!validate()) return

    setIsSubmitting(true)

    try {

      const imageUrls = await uploadImages()

      await createNewProduct(imageUrls, customDescription)

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

    isSubmitting,

    handleImageSelect,
    removeImage,

    handleSubmit,
    handleClose
  }
}