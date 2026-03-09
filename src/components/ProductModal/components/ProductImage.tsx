const SITE_URL = import.meta.env.VITE_SITE_URL

interface ProductImageProps {
  image: string
  name: string
  salePrice?: string
  regularPrice?: string
}

export const ProductImage = ({
  image,
  name,
  salePrice,
  regularPrice,
}: ProductImageProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src =
      `${SITE_URL}/wp-content/uploads/2026/02/ChatGPT-Image-10-февр.-2026-г.-10_22_47.png`
  }

  return (
    <div className="relative bg-slate-100">
      <div className="aspect-square">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>

      {salePrice && regularPrice && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-bold">
          Скидка
        </div>
      )}
    </div>
  )
}