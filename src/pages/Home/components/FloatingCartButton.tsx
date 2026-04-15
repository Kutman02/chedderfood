import { FaShoppingCart } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { openCart, closeCart } from "../../../app/slices/uiSlice";

interface FloatingCartButtonProps {
  cartCount: number;
}

export const FloatingCartButton = ({ cartCount }: FloatingCartButtonProps) => {
  const dispatch = useAppDispatch();
  const isCartOpen = useAppSelector((s) => s.ui.isCartOpen);

  const [searchParams, setSearchParams] = useSearchParams();

  // защита от NaN
  const safeCount = Number(cartCount) || 0;

  if (safeCount === 0) return null;

  const toggleCart = () => {
    const params = new URLSearchParams(searchParams);

    if (isCartOpen) {
      dispatch(closeCart());
      params.delete("modal");
    } else {
      dispatch(openCart());
      params.set("modal", "cart");
    }

    setSearchParams(params);
  };

  return (
    <div className="fixed z-40 animate-in zoom-in-95 duration-400 bottom-[max(1rem,calc(env(safe-area-inset-bottom)+0.75rem))] right-[max(1rem,calc(env(safe-area-inset-right)+0.75rem))]">
      <button
        onClick={toggleCart}
        className="bg-orange-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-full shadow-xl hover:bg-orange-700 hover:shadow-2xl transition-all duration-300 flex items-center gap-2 sm:gap-3 font-bold active:scale-95 border-2 border-white"
        aria-label={`Открыть корзину, товаров: ${safeCount}`}
      >
        <FaShoppingCart className="animate-pulse" />

        <span className="bg-white text-orange-600 px-2 py-1 rounded-full text-sm font-bold">
          {safeCount}
        </span>
      </button>
    </div>
  );
};