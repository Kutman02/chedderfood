import { useState, useEffect, useRef } from "react"
import {
  useGetProductCategoriesQuery,
  useUpdateProductMutation,
  useUploadImageMutation
} from "../../../../app/services/api"

import type {  ProductStatus } from "../../../../types"
import type { ImagePreview, UseEditProductProps } from "../types/editProduct.types"


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

  const [productStatus, setProductStatus] = useState<ProductStatus>("none")
  const [isHidden, setIsHidden] = useState(false)

  const [weight, setWeight] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { data: categories } = useGetProductCategoriesQuery({ per_page: 100 })

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

    setRegularPrice(product.regular_price || "")
    setSalePrice(product.sale_price || "")

    setSelectedCategory(product.categories?.[0]?.id || null)

    setWeight(product.weight?.toString() || "")

    setIsHidden(product.status === "draft")

    if (product.images) {
      setImages(
        product.images.map(img => ({
          preview: img.src,
          id: img.id.toString(),
          imageId: img.id
        }))
      )
    }

    const tags = product.tags || []

    if (tags.some(t => t.slug === "hit")) setProductStatus("hit")
    else if (tags.some(t => t.slug === "new")) setProductStatus("new")
    else if (tags.some(t => t.slug === "sale")) setProductStatus("sale")
    else setProductStatus("none")

  }, [product, isOpen])


  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {

    const files = Array.from(e.target.files || [])

    const newImages: ImagePreview[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(2, 9)
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


  const handleSubmit = async () => {

    if (!product) return

    if (!name || !selectedCategory || images.length === 0 || !regularPrice) {
      alert("Заполните обязательные поля")
      return
    }

    if (weight && (isNaN(parseFloat(weight)) || parseFloat(weight) < 0)) {
      alert("Вес должен быть положительным числом")
      return
    }

    setIsSubmitting(true)

    try {

      const imageIds: number[] = []

      for (const image of images) {

        if (image.imageId) {
          imageIds.push(image.imageId)
          continue
        }

        if (!image.file) continue

        const formData = new FormData()
        formData.append("file", image.file, image.file.name)

        const uploadResult = await uploadImage(formData).unwrap()

        if (uploadResult?.id) {
          imageIds.push(uploadResult.id)
        }

      }


      const tags = productStatus === "none"
        ? []
        : [{ name: productStatus, slug: productStatus }]


      const productData: Record<string, unknown> = {

        name,

        description,
        short_description: description,

        categories: [{ id: selectedCategory }],

        images: imageIds.map(id => ({ id })),

        regular_price: regularPrice,

        status: isHidden ? "draft" : "publish",

        weight: weight || "",

        tags

      }

      if (salePrice) productData.sale_price = salePrice
      else productData.sale_price = ""

      await updateProduct({
        id: product.id,
        ...productData
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