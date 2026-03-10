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

  const filteredCategories =
    categories?.filter((c) => c.name !== "Без категории") ?? []

  return (
    <div>
      <div>
        {isLoading ? (
          <CategorySkeleton count={8} />
        ) : (
          filteredCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.id)}
            >
              {category.name}
            </button>
          ))
        )}
      </div>
    </div>
  )
}