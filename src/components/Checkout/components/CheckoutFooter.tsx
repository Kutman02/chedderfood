import React from "react";
import { FaShoppingBag } from "react-icons/fa";

interface CheckoutFooterProps {
  totalAmount: number;
  cartItemsCount: number;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export const CheckoutFooter: React.FC<CheckoutFooterProps> = ({
  totalAmount,
  cartItemsCount,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <div className="shrink-0 border-t border-slate-200 px-4 py-4 md:p-6 bg-white shadow-lg relative z-20">
      <div className="max-w-2xl mx-auto">

        {/* Total */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg md:text-xl font-bold text-slate-800">
            Итого:
          </span>

          <span className="text-2xl md:text-3xl font-black text-orange-600">
            {totalAmount.toFixed(0)} сом
          </span>
        </div>

        {/* Button */}
        <button
          onClick={onSubmit}
          disabled={isSubmitting || cartItemsCount === 0}
          className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          <FaShoppingBag size={18} />

          {isSubmitting
            ? "Создание заказа..."
            : "Оформить заказ"}
        </button>

      </div>
    </div>
  );
};