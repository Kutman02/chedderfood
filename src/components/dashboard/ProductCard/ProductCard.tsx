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

  // 🔥 SAFE PRODUCT (чтобы UI не падал)
  const safeProduct: Product = {
    ...product,
    name: product.name || "Без названия",
    price: product.price || "0",
    regular_price: product.regular_price || product.price || "0",
    sale_price: product.sale_price || "",
    images: product.images || [],
    categories: product.categories || [],
    tags: product.tags || [],
  }

  return (

    <div
      className={`shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 flex flex-col transition-all duration-300 ease-out
      ${isDragging ? "opacity-50 cursor-move" : ""}`}
      {...dragHandleProps}
    >

      <div className="relative">

        <ProductImage product={safeProduct} />

        <ProductBadges product={safeProduct} />

        {onEdit && (
          <ProductEditButton
            product={safeProduct}
            onEdit={onEdit}
          />
        )}

      </div>

      <div className="p-3">

        <ProductPrice product={safeProduct} />

        <h3 className="font-bold text-sm text-black mb-1 line-clamp-2">
          {safeProduct.name}
        </h3>

        <ProductTags product={safeProduct} />

        <ProductMeta product={safeProduct} />

      </div>

    </div>

  )
}