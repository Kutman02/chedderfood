import type { Tag } from "@/types"

interface TagCardProps {
  tag: Tag
  onEdit: (tag: Tag) => void
  onDelete: (id: number) => void
}

export const TagCard = ({ tag, onEdit, onDelete }: TagCardProps) => {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition hover:shadow-md">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{tag.name}</h3>
        {tag.slug && <p className="text-sm text-gray-500">Slug: {tag.slug}</p>}
        {tag.description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{tag.description}</p>
        )}
      </div>

      <div className="ml-4 flex gap-2">
        <button
          onClick={() => onEdit(tag)}
          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
          title="Редактировать"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>

        <button
          onClick={() => onDelete(tag.id)}
          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
          title="Удалить"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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