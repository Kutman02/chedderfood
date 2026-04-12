import { useState, useEffect, useRef } from "react"

import {
  useGetProductCategoriesQuery,
  useUpdateProductMutation,
  useUploadImageMutation
} from "@/api"
import type { ProductImage } from "@/types"
import type { ImagePreview, ProductTagStatus, UseEditProductProps } from "../types/editProduct.types"

export const useEditProduct = ({
  product,
  onClose,
  isOpen
}: UseEditProductProps) => {

  const [images, setImages] = useState<ImagePreview[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const [regularPrice, setRegularPrice] = useState("")
  const [salePrice, setSalePrice] = useState("")

  const [productStatus, setProductStatus] = useState<ProductTagStatus>("none")
  const [isHidden, setIsHidden] = useState(false)

  const [weight, setWeight] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // 🔥 FIX — без параметров
  const { data: categories } =
    useGetProductCategoriesQuery()

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

    setRegularPrice(product.price || "")
    setSalePrice("")

    setSelectedCategory(product.categories?.[0]?.id || null)

    setWeight(product.weight?.toString() || "")

    setIsHidden(product.status === "draft")

    if (product.images) {
      setImages(
        product.images.map((img: ProductImage) => ({
          preview: img.src,
          id: img.id?.toString() || crypto.randomUUID()
        }))
      )
    }

    setProductStatus("none") // 🔥 убрали tags

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

    const urls: string[] = []

    for (const img of images) {

      // уже URL
      if (!img.file && img.preview) {
        urls.push(img.preview)
        continue
      }

      if (!img.file) continue

      const res = await uploadImage({ file: img.file }).unwrap() as { src: string }

      if (res?.src) {
        urls.push(res.src)
      }
    }

    return urls
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

    setIsSubmitting(true)

    try {

      const imageUrls = await uploadImages()

      const finalDescription = customDescription ?? description

      await updateProduct({
        id: product.id,
        data: {
          name,
          price: Number(salePrice || regularPrice),
          regular_price: Number(regularPrice),
          sale_price: salePrice ? Number(salePrice) : undefined,
          description: finalDescription,
          category_ids: selectedCategory ? [selectedCategory] : [],
          image_ids: [],
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

    productStatus,
    setProductStatus,

    selectedCategory,
    setSelectedCategory,

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
