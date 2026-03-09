import { FaShoppingCart } from "react-icons/fa"
import type { Product } from "../../../types"

import { useAppDispatch } from "../../../app/hooks"
import { addToCart } from "../../../app/slices/cartSlice"
import { useToastStore } from "../../../stores/toastStore"

interface AddToCartButtonProps {
  product: Product
  onClose: () => void
}

export const AddToCartButton = ({ product, onClose }: AddToCartButtonProps) => {
  const dispatch = useAppDispatch()
  const showToast = useToastStore((state) => state.showToast)

  const handleAddToCart = () => {
    dispatch(addToCart(product.id))
    showToast(`Вы добавили "${product.name}" в корзину`, "success")
    onClose()
  }

  return (
    <div className="pt-4 pb-2 md:pb-0">
      <button
        onClick={handleAddToCart}
        disabled={product.stock_status !== "instock"}
        className="w-full bg-orange-600 text-white py-3 md:py-2.5 rounded-xl font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaShoppingCart size={16} />
        В корзину
      </button>
    </div>
  )
}