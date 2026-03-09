import type { Product } from "../../../../types"

export const ProductMeta = ({ product }: { product: Product }) => {

  const weight =
    product.weight
      ? parseFloat(product.weight as string)
      : null

  return (

    <div className="flex items-center gap-2 text-xs text-slate-500">

      {weight && (
        <span>
          {weight >= 1000
            ? `${(weight / 1000).toFixed(1)} кг`
            : `${weight} г`}
        </span>
      )}

      {product.categories?.length > 0 && (
        <span>
          {weight ? "• " : ""}
          {product.categories[0].name}
        </span>
      )}

    </div>

  )

}