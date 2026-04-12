import { CategoryCard } from "./CategoryCard"
import type { CategoriesListProps } from "../types/categories.types"

export const CategoriesList = ({
  categories,
  isLoading,
  error,
  onEdit,
  onDelete,
  onAdd,
}: CategoriesListProps) => {
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-semibold">Ошибка загрузки категорий</p>
        <p className="text-gray-500 text-sm mt-2">{error}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 h-20 rounded-lg animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Нет категорий
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Создайте первую категорию для ваших товаров
        </p>
        <button
          onClick={onAdd}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <svg
            className="mr-2 h-4 w-4"
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
    )
  }

  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
