import { CategoryForm } from "./CategoryForm"
import type { CategoryModalProps } from "../types/categories.types"
import type { CategoryFormData } from "../types/categories.types"

export const CategoryModal = ({
  isOpen,
  isEdit,
  category,
  isSubmitting,
  onClose,
  onSubmit,
}: CategoryModalProps) => {
  if (!isOpen) return null

  const handleSubmit = (data: CategoryFormData) => {
    onSubmit(data)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Редактировать категорию" : "Новая категория"}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            title="Закрыть"
            aria-label="Закрыть модальное окно"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="p-4">
          <CategoryForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            initialData={category}
            submitButtonText={
              isEdit ? "Сохранить изменения" : "Создать категорию"
            }
          />
        </div>
      </div>
    </div>
  )
}
