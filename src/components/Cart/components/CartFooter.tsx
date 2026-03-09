import React from "react";
import { FaShoppingBag } from "react-icons/fa";

interface CartFooterProps {
  totalAmount: number;
  onCheckout: () => void;
}

export const CartFooter: React.FC<CartFooterProps> = ({
  totalAmount,
  onCheckout,
}) => {
  return (
    <div className="shrink-0 border-t border-slate-200 px-4 py-4 md:p-6 bg-white shadow-lg safe-area-bottom relative z-20">
      <div className="max-w-4xl mx-auto">

        {/* Total */}
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <span className="text-lg md:text-xl font-bold text-slate-800">
            Итого:
          </span>

          <span className="text-2xl md:text-3xl font-black text-orange-600">
            {totalAmount} сом
          </span>
        </div>

        {/* Checkout button */}
        <button
          onClick={onCheckout}
          className="w-full bg-orange-600 text-white py-3 md:py-3 rounded-lg md:rounded-xl font-bold hover:bg-orange-700 transition-all duration-300 ease-out flex items-center justify-center gap-2 md:gap-3 text-base md:text-lg active:scale-95 shadow-lg hover:shadow-xl"
        >
          <FaShoppingBag size={18} />
          Далее
        </button>

      </div>
    </div>
  );
};