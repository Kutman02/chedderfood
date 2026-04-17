import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { openCart, closeCart } from "../../../app/slices/uiSlice";
import { HiMiniShoppingCart } from "react-icons/hi2";

interface FloatingCartButtonProps {
  cartCount: number;
  totalAmount: number;
}

export const FloatingCartButton = ({
  cartCount,
  totalAmount,
}: FloatingCartButtonProps) => {
  const dispatch = useAppDispatch();
  const isCartOpen = useAppSelector((s) => s.ui.isCartOpen);

  const [searchParams, setSearchParams] = useSearchParams();

  // защита от NaN
  const safeCount = Number(cartCount) || 0;
  const safeTotal = Number(totalAmount) || 0;
  const displayCount = safeCount > 99 ? "99+" : String(safeCount);
  const displayTotal = `${safeTotal.toFixed(0)} сом`;

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
      <div className="pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 rounded-full border border-orange-200/70 bg-white px-3 py-2 shadow-[0_12px_30px_-18px_rgba(234,88,12,0.9)] transition-all duration-300">
        <div className="whitespace-nowrap text-xs font-semibold text-slate-500">
          Итого
        </div>
        <div className="whitespace-nowrap text-sm font-black text-orange-700">
          {displayTotal}
        </div>
      </div>

      <button
        onClick={toggleCart}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-white shadow-[0_10px_30px_-10px_rgba(234,88,12,0.85)] ring-4 ring-white/95 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-[0_14px_35px_-12px_rgba(194,65,12,0.9)] active:scale-95 sm:h-16 sm:w-16"
        aria-label={`Открыть корзину, товаров: ${safeCount}, сумма: ${displayTotal}`}
      >
        <HiMiniShoppingCart className="text-[20px] sm:text-[22px]" />

        <span className="absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1 text-[11px] font-black leading-none text-orange-700 ring-2 ring-orange-200 sm:h-7 sm:min-w-7 sm:text-xs">
          {displayCount}
        </span>
      </button>
    </div>
  );
};