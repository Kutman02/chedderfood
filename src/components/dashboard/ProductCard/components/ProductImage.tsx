import { FaImage } from "react-icons/fa"
import type { Product } from "@/types"

const SITE_URL = import.meta.env.VITE_SITE_URL

export const ProductImage = ({ product }: { product: Product }) => {

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].src
      : null

  return (

    <div className="relative w-full aspect-square bg-slate-100 overflow-hidden rounded-2xl shadow-md">

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `${SITE_URL}/wp-content/uploads/2026/01/7c37a436b7677921ef8d6256cd482ffb1509cf54-1120x1120-1.webp`
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