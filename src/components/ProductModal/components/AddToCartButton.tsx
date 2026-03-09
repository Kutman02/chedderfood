import { FaShoppingCart } from "react-icons/fa"

interface AddToCartButtonProps {
  productId: number
  price: string
  onAddToCart: (productId: number) => void
  disabled?: boolean
}

export const AddToCartButton = ({
  productId,
  price,
  onAddToCart,
  disabled = false,
}: AddToCartButtonProps) => {

  const handleClick = () => {
    onAddToCart(productId)
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="w-full bg-orange-600 text-white py-4 rounded-xl font-black hover:bg-orange-700 transition-colors flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FaShoppingCart />
      В корзину за {price} сом
    </button>
  )
}