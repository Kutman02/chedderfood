import { useCallback, useEffect, useMemo, useState } from "react"
import { FaPlus } from "react-icons/fa"
import { useGetTagsQuery } from "@/api"
import { useTagActions, useTagModal } from "./hooks"
import { TagModal, TagsList } from "./components"
import type { TagFormData } from "./types/tags.types"

interface TagsManagerProps {
  searchQuery?: string
  setSearchMeta?: (
    section: "orders" | "products" | "customers" | "categories" | "tags",
    meta: { found: number; total: number; loading?: boolean }
  ) => void
}

export const TagsManager = ({
  searchQuery = "",
  setSearchMeta,
}: TagsManagerProps) => {
  const { data: tags = [], isLoading, error } = useGetTagsQuery()

  const modal = useTagModal()
  const actions = useTagActions({ onSuccess: modal.handleClose })

  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const filteredTags = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      return tags
    }

    return tags.filter((tag) =>
      [tag.name, tag.slug, tag.description]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(query))
    )
  }, [searchQuery, tags])

  useEffect(() => {
    if (!setSearchMeta) {
      return
    }

    setSearchMeta("tags", {
      found: filteredTags.length,
      total: tags.length,
      loading: isLoading,
    })
  }, [filteredTags.length, isLoading, setSearchMeta, tags.length])

  const handleCreate = useCallback(
    (data: TagFormData) => {
      actions.handleCreate(data)
    },
    [actions]
  )

  const handleUpdate = useCallback(
    (data: TagFormData) => {
      if (modal.selectedTag) {
        actions.handleUpdate(modal.selectedTag.id, data)
      }
    },
    [actions, modal.selectedTag]
  )

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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Метки товаров</h1>
          <p className="mt-1 text-sm text-gray-500">
            Управляйте единым списком меток для клиента и админки
          </p>
        </div>
        <button
          onClick={modal.handleOpenCreate}
          aria-label="Новая метка"
          title="Новая метка"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700"
        >
          <FaPlus size={16} />
        </button>
      </div>

      <TagsList
        tags={filteredTags}
        isLoading={isLoading}
        error={error instanceof Error ? error.message : undefined}
        onEdit={modal.handleOpenEdit}
        onDelete={(id) => setDeleteConfirm(id)}
        onAdd={modal.handleOpenCreate}
      />

      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg bg-white shadow-xl">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">Удалить метку?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Это действие нельзя отменить. {tags.find((tag) => tag.id === deleteConfirm)?.name &&
                  `Метка "${tags.find((tag) => tag.id === deleteConfirm)?.name}" будет удалена.`}
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={actions.isSubmitting}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Отмена
                </button>
                <button
                  onClick={() => handleDeleteConfirm(deleteConfirm)}
                  disabled={actions.isSubmitting}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {actions.isSubmitting ? "Удаление..." : "Удалить"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <TagModal
        isOpen={modal.isOpen}
        isEdit={modal.isEdit}
        tag={modal.selectedTag}
        isSubmitting={actions.isSubmitting}
        onClose={modal.handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default TagsManager