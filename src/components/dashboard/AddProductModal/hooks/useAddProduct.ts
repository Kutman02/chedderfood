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

  const { data: categories } = useGetProductCategoriesQuery({
    per_page: 100
  })

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
      id: crypto.randomUUID() // ✅ безопаснее
    }))

    setImages(prev => [...prev, ...newImages])
  }

  /* ===============================
     REMOVE IMAGE
  =============================== */

  const removeImage = (id: string) => {

    setImages(prev => {

      const image = prev.find(img => img.id === id)

      if (image) {
        URL.revokeObjectURL(image.preview)
      }

      return prev.filter(img => img.id !== id)

    })
  }

  /* ===============================
     VALIDATION
  =============================== */

  const validate = () => {

    if (!name || !selectedCategory || images.length === 0 || !regularPrice) {
      alert("Заполните обязательные поля")
      return false
    }

    if (weight && (isNaN(parseFloat(weight)) || parseFloat(weight) < 0)) {
      alert("Вес должен быть положительным числом")
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

      if (!image.file) continue // ✅ safety

      const formData = new FormData()
      formData.append("file", image.file, image.file.name)

      const result = await uploadImage(formData).unwrap()

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

    const finalDescription = customDescription ?? description

    const productData: Record<string, unknown> = {

      name,

      type: "simple",
      status: "publish",

      categories: [{ id: selectedCategory }],

      images: imageIds.map(id => ({ id })),

      description: finalDescription,
      short_description: finalDescription,

      regular_price: regularPrice,

      stock_status: "instock",

      weight: weight || ""
    }

    // ✅ фикс: всегда отправляем поле
    productData.sale_price = salePrice || ""

    await createProduct(productData).unwrap()
  }

  /* ===============================
     RESET FORM
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

  /* ===============================
     CLOSE MODAL
  =============================== */

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