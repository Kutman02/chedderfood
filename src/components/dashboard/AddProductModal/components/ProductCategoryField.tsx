import { FaTag } from "react-icons/fa"
import type { ProductCategory } from "../types/addProduct.types"

type ProductCategoryFieldProps = {
  categories?: ProductCategory[]
  selectedCategory: number | null
  setSelectedCategory: (value: number) => void
}

export const ProductCategoryField = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: ProductCategoryFieldProps) => {
  return (
    <div>
      <label className="text-sm font-black text-slate-700 mb-2 flex items-center gap-2">
        <FaTag /> Категория *
      </label>

      <select
        value={selectedCategory || ""}
        aria-label="Выберите категорию товара"
        onChange={(event) => setSelectedCategory(parseInt(event.target.value))}
        className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-orange-500 outline-none font-semibold bg-white"
      >
        <option value="">Выберите категорию</option>

        {categories?.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  )
}
