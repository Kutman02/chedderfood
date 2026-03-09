import type { Product } from "../../../types"

import { ProductImage } from "./components/ProductImage"
import { ProductBadges } from "./components/ProductBadges"
import { ProductEditButton } from "./components/ProductEditButton"
import { ProductPrice } from "./components/ProductPrice"
import { ProductTags } from "./components/ProductTags"
import { ProductMeta } from "./components/ProductMeta"

interface ProductCardProps {
  product: Product
  onEdit?: (product: Product) => void
  isDragging?: boolean
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
}

export const ProductCard = ({
  product,
  onEdit,
  isDragging,
  dragHandleProps
}: ProductCardProps) => {

  return (

    <div
      className={`shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 flex flex-col transition-all duration-300 ease-out
      ${isDragging ? "opacity-50 cursor-move" : ""}`}
      {...dragHandleProps}
    >

      <div className="relative">

        <ProductImage product={product} />

        <ProductBadges product={product} />

        {onEdit && (
          <ProductEditButton
            product={product}
            onEdit={onEdit}
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

}