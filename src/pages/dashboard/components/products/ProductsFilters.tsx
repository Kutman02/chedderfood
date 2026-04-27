import {
  FaEye,
  FaEyeSlash,
  FaPlus,
} from "react-icons/fa"
import type { ProductStatusFilter } from "../../hooks/products/types"

type Category = {
  id: number
  name: string
}

type ProductsFiltersProps = {
  categories?: Category[]
  selectedCategoryFilter: number | null
  setSelectedCategoryFilter: (id: number | null) => void
  selectedStatusFilter: ProductStatusFilter
  setSelectedStatusFilter: (value: ProductStatusFilter) => void
  onAddProduct: () => void
}

export const ProductsFilters = ({
  categories = [],
  selectedCategoryFilter,
  setSelectedCategoryFilter,
  selectedStatusFilter,
  setSelectedStatusFilter,
  onAddProduct,
}: ProductsFiltersProps) => {
  const safeCategories = Array.isArray(categories) ? categories : []

  return (
    <div className="mb-6 space-y-4">
      <button
        onClick={onAddProduct}
        aria-label="Добавить товар"
        title="Добавить товар"
        className="w-full md:w-11 h-12 md:h-11 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl font-black flex items-center justify-center hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg text-base md:text-sm"
      >
        <FaPlus />
      </button>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2">
        <button
          onClick={() => setSelectedCategoryFilter(null)}
          className={`px-4 py-2.5 md:py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap shrink-0 ${
            !selectedCategoryFilter
              ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg"
              : "bg-white border-2 border-slate-200 text-slate-600"
          }`}
        >
          Все товары
        </button>

        {safeCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategoryFilter(category.id)}
            className={`px-4 py-2.5 md:py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap shrink-0 ${
              selectedCategoryFilter === category.id
                ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                : "bg-white border-2 border-slate-200 text-slate-600"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2">
        <button
          onClick={() => setSelectedStatusFilter("all")}
          className={`px-4 py-2.5 md:py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap shrink-0 ${
            selectedStatusFilter === "all"
              ? "bg-linear-to-r from-purple-500 to-purple-600 text-white shadow-lg"
              : "bg-white border-2 border-slate-200 text-slate-600"
          }`}
        >
          Все статусы
        </button>

        <button
          onClick={() => setSelectedStatusFilter("publish")}
          className={`px-4 py-2.5 md:py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap shrink-0 ${
            selectedStatusFilter === "publish"
              ? "bg-linear-to-r from-green-500 to-green-600 text-white shadow-lg"
              : "bg-white border-2 border-slate-200 text-slate-600"
          }`}
        >
          <FaEye className="inline mr-1" size={12} />
          Видимые
        </button>

        <button
          onClick={() => setSelectedStatusFilter("draft")}
          className={`px-4 py-2.5 md:py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap shrink-0 ${
            selectedStatusFilter === "draft"
              ? "bg-linear-to-r from-red-500 to-red-600 text-white shadow-lg"
              : "bg-white border-2 border-slate-200 text-slate-600"
          }`}
        >
          <FaEyeSlash className="inline mr-1" size={12} />
          Скрытые
        </button>
      </div>
    </div>
  )
}
