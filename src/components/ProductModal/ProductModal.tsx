import React from "react"
import type { Product } from "../../types"

import {
  ModalHeader,
  ProductImage,
  ProductInfo,
  AddToCartButton,
} from "./components"

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (productId: number) => void
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !product) return null

  const productImage = product.images?.[0]?.src || "/placeholder-image.jpg"
  const productPrice = product.sale_price || product.price || "0"

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-20 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        
        <ModalHeader
          title={product.name}
          onClose={onClose}
        />

        <div className="grid md:grid-cols-2">

          <ProductImage
            image={productImage}
            name={product.name}
            salePrice={product.sale_price}
            regularPrice={product.regular_price}
          />

          <ProductInfo
            description={product.description}
            price={productPrice}
            salePrice={product.sale_price}
            regularPrice={product.regular_price}
          >
            <AddToCartButton
              productId={product.id}
              price={productPrice}
              onAddToCart={onAddToCart}
              disabled={product.stock_status !== "instock"}
            />
          </ProductInfo>

        </div>
      </div>
    </div>
  )
}