import { TagCard } from "./TagCard"
import type { TagsListProps } from "../types/tags.types"

export const TagsList = ({
  tags,
  isLoading,
  error,
  onEdit,
  onDelete,
  onAdd,
}: TagsListProps) => {
  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="font-semibold text-red-500">Ошибка загрузки меток</p>
        <p className="mt-2 text-sm text-gray-500">{error}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    )
  }

  if (tags.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h10M7 12h6m-6 5h10M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Нет меток</h3>
        <p className="mt-1 text-sm text-gray-500">Создайте первую метку для товаров</p>
        <button
          onClick={onAdd}
          className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Новая метка
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tags.map((tag) => (
        <TagCard key={tag.id} tag={tag} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}