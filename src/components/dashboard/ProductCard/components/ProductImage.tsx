import { FaImage } from "react-icons/fa"
import type { Product } from "@/types"

const SITE_URL = import.meta.env.VITE_SITE_URL

export const ProductImage = ({ product }: { product: Product }) => {

  // 🔥 безопасно достаём первую картинку
  const rawSrc = product.images?.[0]?.src || ""

  // 🔥 нормализуем URL (если относительный)
  const imageUrl = rawSrc.startsWith("http")
    ? rawSrc
    : rawSrc
    ? `${SITE_URL}${rawSrc}`
    : ""

  // 🔥 универсальный fallback
  const fallback =
    "https://via.placeholder.com/500x500?text=No+Image"

  return (

    <div className="relative w-full aspect-square bg-slate-100 overflow-hidden rounded-2xl shadow-md">

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={product.name || "product"}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallback
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <FaImage className="text-slate-400 text-4xl" />
        </div>
      )}

    </div>

  )
}