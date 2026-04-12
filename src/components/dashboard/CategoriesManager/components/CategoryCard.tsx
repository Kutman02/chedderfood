import type { Category } from "@/types"

interface CategoryCardProps {
  category: Category
  onEdit: (category: Category) => void
  onDelete: (id: number) => void
}

export const CategoryCard = ({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition flex items-center justify-between">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{category.name}</h3>
        {category.slug && (
          <p className="text-sm text-gray-500">Slug: {category.slug}</p>
        )}
        {category.description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>

      <div className="flex gap-2 ml-4">
        <button
          onClick={() => onEdit(category)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
          title="Редактировать"
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>

        <button
          onClick={() => onDelete(category.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          title="Удалить"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
