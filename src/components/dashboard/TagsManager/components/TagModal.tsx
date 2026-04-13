import { TagForm } from "./TagForm"
import type { TagFormData, TagModalProps } from "../types/tags.types"

export const TagModal = ({
  isOpen,
  isEdit,
  tag,
  isSubmitting,
  onClose,
  onSubmit,
}: TagModalProps) => {
  if (!isOpen) return null

  const handleSubmit = (data: TagFormData) => {
    onSubmit(data)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Редактировать метку" : "Новая метка"}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-500 transition hover:text-gray-700 disabled:opacity-50"
            aria-label="Закрыть модальное окно"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <TagForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            initialData={tag}
            submitButtonText={isEdit ? "Сохранить изменения" : "Создать метку"}
          />
        </div>
      </div>
    </div>
  )
}