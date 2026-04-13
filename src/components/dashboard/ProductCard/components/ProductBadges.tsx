import { FaEyeSlash } from "react-icons/fa"
import type { Product } from "@/types"

export const ProductBadges = ({ product }: { product: Product }) => {

  const isHidden = product.status === "draft"
  const isOutOfStock = product.stock_status !== "instock"

  return (
    <div className="absolute top-2 left-2 flex flex-col gap-1">

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