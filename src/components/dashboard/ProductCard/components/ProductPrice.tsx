import type { Product } from "@/entities/product/model/types"

export const ProductPrice = ({ product }: { product: Product }) => {

  // 🔥 берём приоритетно sale_price
  const rawPrice = product.sale_price || product.price || "0"
  const rawRegular = product.regular_price || "0"

  // 🔥 переводим в number
  const priceNumber = Number(rawPrice)
  const regularNumber = Number(rawRegular)

  // 🔥 FIX: если цена выглядит как 619000 → делим
  const normalize = (value: number) => {
    if (value > 10000) {
      return value / 100 // Woo иногда даёт в копейках
    }
    return value
  }

  const finalPrice = normalize(priceNumber)
  const finalRegular = normalize(regularNumber)

  // 🔥 форматирование
  const format = (value: number) =>
    new Intl.NumberFormat("ru-RU").format(value)

  return (

    <div className="flex items-center gap-2 mb-1">

      <span className="text-xl font-bold text-orange-500">
        {format(finalPrice)} сом
      </span>

      {product.sale_price && finalRegular > finalPrice && (
        <span className="text-sm text-slate-400 line-through">
          {format(finalRegular)} сом
        </span>
      )}

    </div>

  )
}