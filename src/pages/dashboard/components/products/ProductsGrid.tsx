import { FaBox } from "react-icons/fa"
import type { DragEvent } from "react"

import { ProductCard } from "@/components/dashboard/ProductCard/ProductCard"
import type { Product } from "@/types"

type ProductsGridProps = {
  sortedProducts: Product[]
  draggedProductId: number | null
  onDragStart: (event: DragEvent, id: number) => void
  onDragOver: (event: DragEvent) => void
  onDrop: (event: DragEvent, id: number) => void
  onEditProduct: (product: Product) => void
}

export const ProductsGrid = ({
  sortedProducts,
  draggedProductId,
  onDragStart,
  onDragOver,
  onDrop,
  onEditProduct,
}: ProductsGridProps) => {
  if (sortedProducts.length === 0) {
    return (
      <div className="text-center py-20">
        <FaBox className="text-6xl text-slate-300 mx-auto mb-4" />

        <p className="text-slate-500 text-lg mb-2">
          Товары не найдены
        </p>

        <p className="text-slate-400 text-sm">
          Начните с добавления первого товара
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
      {sortedProducts.map((product) => (
        <div
          key={product.id}
          draggable
          onDragStart={(event) => onDragStart(event, product.id)}
          onDragOver={onDragOver}
          onDrop={(event) => onDrop(event, product.id)}
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
  )
}
