import { FaTag } from "react-icons/fa"
import type { Tag } from "@/types"

interface ProductTagSelectorProps {
  tags?: Tag[]
  selectedTagIds: number[]
  onChange: React.Dispatch<React.SetStateAction<number[]>>
  label?: string
  helperText?: string
  maxSelected?: number
}

export const ProductTagSelector = ({
  tags = [],
  selectedTagIds,
  onChange,
  label = "Метки",
  helperText,
  maxSelected,
}: ProductTagSelectorProps) => {
  const toggleTag = (tagId: number) => {
    onChange((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : maxSelected && prev.length >= maxSelected
          ? prev
          : [...prev, tagId]
    )
  }

  return (
    <div>
      <label className="text-sm font-black text-slate-700 mb-2 flex items-center gap-2">
        <FaTag /> {label}
      </label>

      {helperText && (
        <p className="mb-2 text-xs text-slate-500">{helperText}</p>
      )}

      {tags.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500">
          Метки пока не созданы
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const isSelected = selectedTagIds.includes(tag.id)

            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                  isSelected
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-orange-300"
                }`}
              >
                {tag.name}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}