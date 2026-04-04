import {
  FaPlus,
  FaBox,
  FaEye,
  FaEyeSlash
} from "react-icons/fa"

import { ProductCard } from "@/components/dashboard/ProductCard/ProductCard"

import type { Product } from "@/types"

type Category = {
  id: number
  name: string
}

type Props = {
  products: Product[]
  sortedProducts: Product[]

  categories?: Category[]

  selectedCategoryFilter: number | null
  setSelectedCategoryFilter: (id: number | null) => void

  selectedStatusFilter: "all" | "publish" | "draft"
  setSelectedStatusFilter: (v: "all" | "publish" | "draft") => void

  onAddProduct: () => void
  onEditProduct: (product: Product) => void

  draggedProductId: number | null

  onDragStart: (e: React.DragEvent, id: number) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, id: number) => void
}

export const ProductsSection = ({
  sortedProducts = [],
  categories = [],

  selectedCategoryFilter,
  setSelectedCategoryFilter,

  selectedStatusFilter,
  setSelectedStatusFilter,

  onAddProduct,
  onEditProduct,

  draggedProductId,

  onDragStart,
  onDragOver,
  onDrop

}: Props) => {

  return (
    <>
      {/* Кнопка + фильтры */}

      <div className="mb-6 space-y-4">

        <button
          onClick={onAddProduct}
          className="w-full md:w-auto bg-linear-to-r from-orange-500 to-orange-600 text-white px-6 py-4 md:py-3 rounded-xl font-black flex items-center justify-center gap-2 hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg text-base md:text-sm"
        >
          <FaPlus /> Добавить товар
        </button>

        {/* Категории */}

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

          {categories.map((cat) => (

            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-4 py-2.5 md:py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap shrink-0 ${
                selectedCategoryFilter === cat.id
                  ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                  : "bg-white border-2 border-slate-200 text-slate-600"
              }`}
            >
              {cat.name}
            </button>

          ))}
        </div>

        {/* Фильтр статуса */}

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

      {/* Нет товаров */}

      {sortedProducts.length === 0 && (
        <div className="text-center py-20">

          <FaBox className="text-6xl text-slate-300 mx-auto mb-4" />

          <p className="text-slate-500 text-lg mb-2">
            Товары не найдены
          </p>

          <p className="text-slate-400 text-sm">
            Начните с добавления первого товара
          </p>

        </div>
      )}

      {/* Список товаров */}

      {sortedProducts.length > 0 && (

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">

          {sortedProducts.map((product) => (

            <div
              key={product.id}
              draggable
              onDragStart={(e) => onDragStart(e, product.id)}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, product.id)}
              className={`relative ${
                draggedProductId === product.id ? "opacity-50" : ""
              }`}
            >

              <ProductCard
                product={product}
                onEdit={onEditProduct}
                isDragging={draggedProductId === product.id}
              />

            </div>

          ))}

          <div className="col-span-full text-xs md:text-sm text-slate-400 text-center mt-6">
            💡 Перетащите товары для изменения порядка отображения
          </div>

        </div>

      )}
    </>
  )
}