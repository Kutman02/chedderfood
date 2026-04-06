import { memo } from "react"
import type { Product } from "@/types"

import {
  ProductImage,
  ProductBadges,
  ProductEditButton,
  ProductPrice,
  ProductTags,
  ProductMeta
} from "./components"

interface ProductCardProps {
  product: Product
  onClick?: () => void
  onEdit?: (product: Product) => void
  isDragging?: boolean
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
}

export const ProductCard = memo(({
  product,
  onClick,
  onEdit,
  isDragging,
  dragHandleProps
}: ProductCardProps) => {

  return (
    <div
      onClick={onClick}
      className={`shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 flex flex-col transition-all duration-300 ease-out cursor-pointer
      ${isDragging ? "opacity-50 cursor-move" : ""}`}
      {...dragHandleProps}
    >

      <div className="relative">

        <ProductImage product={product} />

        <ProductBadges product={product} />

        {onEdit && (
          <ProductEditButton
            product={product}
            onEdit={(p) => {
              event?.stopPropagation()
              onEdit(p)
            }}
          />
        )}

      </div>

      <div className="p-3">

        <ProductPrice product={product} />

        <h3 className="font-bold text-sm text-black mb-1 line-clamp-2">
          {product.name}
        </h3>

        <ProductTags product={product} />

        <ProductMeta product={product} />

      </div>

    </div>
  )
})