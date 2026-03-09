import type { Product } from "../../../../types"

export const ProductPrice = ({ product }: { product: Product }) => {

  const price = product.sale_price || product.price || "0"

  return (

    <div className="flex items-center gap-2 mb-1">

      <span className="text-xl font-bold text-orange-500">
        {price} сом
      </span>

      {product.sale_price && product.regular_price && (
        <span className="text-sm text-slate-400 line-through">
          {product.regular_price} сом
        </span>
      )}

    </div>

  )

}