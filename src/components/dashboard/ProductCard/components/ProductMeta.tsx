import type { Product } from "@/entities/product/model/types"

export const ProductMeta = ({ product }: { product: Product }) => {

  // 🔥 безопасный парс веса
  let weight: number | null = null

  if (product.weight !== undefined && product.weight !== null && product.weight !== "") {
    const parsed = parseFloat(String(product.weight))
    if (!isNaN(parsed) && parsed > 0) {
      weight = parsed
    }
  }

  const categoryName =
    product.categories?.[0]?.name || null

  return (

    <div className="flex items-center gap-2 text-xs text-slate-500">

      {weight !== null && (
        <span>
          {weight >= 1000
            ? `${(weight / 1000).toFixed(1)} кг`
            : `${weight} г`}
        </span>
      )}

      {categoryName && (
        <span>
          {weight !== null ? "• " : ""}
          {categoryName}
        </span>
      )}

    </div>

  )

}