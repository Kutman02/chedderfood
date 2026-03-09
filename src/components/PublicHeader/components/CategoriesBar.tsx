import { CategorySkeleton } from "../../Skeleton/components"

interface Category {
  id: number
  name: string
  slug: string
}

interface CategoriesBarProps {
  categories?: Category[]
  isLoading: boolean
  selectedCategory: number | null
  onCategoryClick: (categoryId: number) => void
}

export const CategoriesBar = ({
  categories,
  isLoading,
  selectedCategory,
  onCategoryClick,
}: CategoriesBarProps) => {
  return (
    <div className="border-t border-slate-200/50 py-2">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {isLoading ? (
          <CategorySkeleton count={8} />
        ) : (
          categories
            ?.filter((category) => category.name !== "Без категории")
            .map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryClick(category.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all shrink-0 ${
                  selectedCategory === category.id
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                    : "bg-white/60 text-slate-700 hover:bg-white/80 backdrop-blur-sm border border-slate-200/50"
                }`}
              >
                {category.name}
              </button>
            ))
        )}
      </div>
    </div>
  )
}