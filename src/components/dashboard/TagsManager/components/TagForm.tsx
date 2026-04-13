import { useEffect, useState } from "react"
import type { TagFormData, TagFormProps } from "../types/tags.types"

export const TagForm = ({
  onSubmit,
  isSubmitting,
  initialData,
  submitButtonText = "Создать метку",
}: TagFormProps) => {
  const [formData, setFormData] = useState<TagFormData>({
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
    const nextErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      nextErrors.name = "Название обязательно"
    } else if (formData.name.length > 100) {
      nextErrors.name = "Название не может быть больше 100 символов"
    }

    if (formData.slug && formData.slug.length > 100) {
      nextErrors.slug = "Slug не может быть больше 100 символов"
    }

    if (formData.description && formData.description.length > 500) {
      nextErrors.description = "Описание не может быть больше 500 символов"
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => {
        const nextErrors = { ...prev }
        delete nextErrors[name]
        return nextErrors
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
          Название *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          maxLength={100}
          disabled={isSubmitting}
          className={`w-full rounded-lg border px-4 py-2 transition focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
            errors.name ? "border-red-500" : "border-gray-300"
          } disabled:cursor-not-allowed disabled:bg-gray-100`}
          placeholder="Например: Новинка"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium text-gray-700">
          URL Slug
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          value={formData.slug}
          onChange={handleChange}
          maxLength={100}
          disabled={isSubmitting}
          className={`w-full rounded-lg border px-4 py-2 transition focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
            errors.slug ? "border-red-500" : "border-gray-300"
          } disabled:cursor-not-allowed disabled:bg-gray-100`}
          placeholder="Например: novinka"
        />
        {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug}</p>}
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
          Описание
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={500}
          disabled={isSubmitting}
          rows={3}
          className={`w-full resize-none rounded-lg border px-4 py-2 transition focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
            errors.description ? "border-red-500" : "border-gray-300"
          } disabled:cursor-not-allowed disabled:bg-gray-100`}
          placeholder="Опишите, где используется эта метка"
        />
        <div className="mt-1 text-xs text-gray-500">{formData.description?.length || 0}/500</div>
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isSubmitting ? "Сохранение..." : submitButtonText}
      </button>
    </form>
  )
}