import { useState, useCallback } from "react"
import { useGetCategoriesQuery } from "@/api"
import { useCategoryActions, useCategoryModal } from "./hooks"
import { CategoriesList, CategoryModal } from "./components"
import type { CategoryFormData } from "./types/categories.types"

/*
 * CategoriesManager Component
 * Main component for managing product categories
 * 
 * Responsibilities:
 * - Fetch categories from API
 * - Handle create, update, delete operations
 * - Manage modal state for category creation/editing
 * - Display categories list
 */

export const CategoriesManager = () => {
  // API & Data
  const { data: categories = [], isLoading, error } = useGetCategoriesQuery()

  // Modal State
  const modal = useCategoryModal()

  // Category Actions
  const actions = useCategoryActions({
    onSuccess: modal.handleClose,
  })

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  // Handle Create
  const handleCreate = useCallback(
    (data: CategoryFormData) => {
      actions.handleCreate(data)
    },
    [actions]
  )

  // Handle Update
  const handleUpdate = useCallback(
    (data: CategoryFormData) => {
      if (modal.selectedCategory) {
        actions.handleUpdate(modal.selectedCategory.id, data)
      }
    },
    [actions, modal.selectedCategory]
  )

  // Handle Delete with confirmation
  const handleDeleteConfirm = useCallback(
    async (id: number) => {
      await actions.handleDelete(id)
      setDeleteConfirm(null)
    },
    [actions]
  )

  const handleSubmit = modal.isEdit ? handleUpdate : handleCreate

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Категории товаров</h1>
          <p className="text-gray-500 text-sm mt-1">
            Управляйте категориями для ваших товаров
          </p>
        </div>
        <button
          onClick={modal.handleOpenCreate}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Новая категория
        </button>
      </div>

      {/* Categories List */}
      <CategoriesList
        categories={categories}
        isLoading={isLoading}
        error={error instanceof Error ? error.message : undefined}
        onEdit={modal.handleOpenEdit}
        onDelete={(id) => setDeleteConfirm(id)}
        onAdd={modal.handleOpenCreate}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Удалить категорию?
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                Это действие не может быть отменено.{" "}
                {categories.find((c) => c.id === deleteConfirm)?.name &&
                  `Категория "${categories.find((c) => c.id === deleteConfirm)?.name}" будет удалена`}
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={actions.isSubmitting}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Отмена
                </button>
                <button
                  onClick={() => handleDeleteConfirm(deleteConfirm)}
                  disabled={actions.isSubmitting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition disabled:opacity-50"
                >
                  {actions.isSubmitting ? "Удаление..." : "Удалить"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      <CategoryModal
        isOpen={modal.isOpen}
        isEdit={modal.isEdit}
        category={modal.selectedCategory}
        isSubmitting={actions.isSubmitting}
        onClose={modal.handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default CategoriesManager
