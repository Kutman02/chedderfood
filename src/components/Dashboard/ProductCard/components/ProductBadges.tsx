import { FaFire, FaStar, FaGift, FaEyeSlash } from "react-icons/fa"
import type { Product } from "../../../../types"

export const ProductBadges = ({ product }: { product: Product }) => {

  const tags = product.tags || []

  const isHidden = product.status === "draft"
  const isOutOfStock =
    product.stock_status && product.stock_status !== "instock"

  const status =
    tags.find(t => t.slug === "hit") ? "hit"
      : tags.find(t => t.slug === "new") ? "new"
        : tags.find(t => t.slug === "sale") ? "sale"
          : null

  return (

    <div className="absolute top-2 left-2 flex flex-col gap-1">

      {status === "hit" && (
        <div className="bg-red-600 text-white px-2 py-1 rounded text-[11px] flex items-center gap-1">
          <FaFire size={10}/> Хит продаж
        </div>
      )}

      {status === "new" && (
        <div className="bg-blue-600 text-white px-2 py-1 rounded text-[11px] flex items-center gap-1">
          <FaStar size={10}/> Новинка
        </div>
      )}

      {status === "sale" && (
        <div className="bg-green-600 text-white px-2 py-1 rounded text-[11px] flex items-center gap-1">
          <FaGift size={10}/> Скидка
        </div>
      )}

      {isOutOfStock && (
        <div className="bg-red-600 text-white px-2 py-1 rounded text-[11px]">
          Нет в наличии
        </div>
      )}

      {isHidden && (
        <div className="bg-orange-600 text-white px-2 py-1 rounded text-[11px] flex items-center gap-1">
          <FaEyeSlash size={10}/> Скрыт
        </div>
      )}

    </div>

  )

}