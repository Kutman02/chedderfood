import { useState } from "react"
import type { Product } from "@/entities/product/model/types"

const SITE_URL = import.meta.env.VITE_SITE_URL

interface ProductImageGalleryProps {
  product: Product
}

export const ProductImageGallery = ({ product }: ProductImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)

  const productImages = product.images || []

  const currentImage = productImages[currentImageIndex]
  const productImage = currentImage?.src || "/placeholder-image.jpg"

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1)
    }
  }

  const handleNextImage = () => {
    if (currentImageIndex < productImages.length - 1) {
      setCurrentImageIndex((prev) => prev + 1)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setCurrentX(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    setCurrentX(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    const deltaX = startX - currentX
    const swipeThreshold = 50

    if (deltaX > swipeThreshold && currentImageIndex < productImages.length - 1) {
      setCurrentImageIndex((prev) => prev + 1)
    }

    if (deltaX < -swipeThreshold && currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1)
    }

    setIsDragging(false)
  }

  return (
    <div className="md:w-1/2 relative shrink-0">
      <div
        className="aspect-square bg-slate-100"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src =
              `${SITE_URL}/wp-content/uploads/2026/02/ChatGPT-Image.png`
          }}
        />

        {productImages.length > 1 && (
          <>
            <button
            aria-label="Предыдущее изображение"
              onClick={handlePrevImage}
              disabled={currentImageIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed rounded-full z-10"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
            aria-label="Следующее изображение"
              onClick={handleNextImage}
              disabled={currentImageIndex === productImages.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed rounded-full z-10"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {productImages.length > 1 && (
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 text-sm font-bold rounded">
            {currentImageIndex + 1} / {productImages.length}
          </div>
        )}
      </div>
    </div>
  )
}