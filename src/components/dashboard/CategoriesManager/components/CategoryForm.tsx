import { useState, useEffect } from "react"
import type { CategoryFormData, CategoryFormProps } from "../types/categories.types"

export const CategoryForm = ({
  onSubmit,
  isSubmitting,
  initialData,
  submitButtonText = "Создать категорию",
}: CategoryFormProps) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        slug: initialData.slug || "",
        description: initialData.description || "",
      })
    }
  }, [initialData])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Название обязательно"
    } else if (formData.name.length > 100) {
      newErrors.name = "Название не может быть больше 100 символов"
    }

    if (formData.slug && formData.slug.length > 100) {
      newErrors.slug = "Slug не может быть больше 100 символов"
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Описание не может быть больше 500 символов"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit(formData)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Название *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          maxLength={100}
          disabled={isSubmitting}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
            errors.name ? "border-red-500" : "border-gray-300"
          } disabled:bg-gray-100 disabled:cursor-not-allowed`}
          placeholder="е.g., Бургеры, Напитки"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Slug Field */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
          URL Slug (опционально)
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          maxLength={100}
          disabled={isSubmitting}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
            errors.slug ? "border-red-500" : "border-gray-300"
          } disabled:bg-gray-100 disabled:cursor-not-allowed`}
          placeholder="e.g., burgers, drinks"
        />
        {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Описание (опционально)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={500}
          disabled={isSubmitting}
          rows={3}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${
            errors.description ? "border-red-500" : "border-gray-300"
          } disabled:bg-gray-100 disabled:cursor-not-allowed`}
          placeholder="Опишите эту категорию..."
        />
        <div className="text-xs text-gray-500 mt-1">
          {formData.description?.length || 0}/500
        </div>
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Сохранение..." : submitButtonText}
      </button>
    </form>
  )
}
