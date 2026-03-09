
import React from "react";
import { FaTimes, FaTrash, FaShoppingBag } from "react-icons/fa";

interface CartHeaderProps {
  totalItems: number;
  onClose: () => void;
  onClearCart: () => void;
  hasItems: boolean;
}

export const CartHeader: React.FC<CartHeaderProps> = ({
  totalItems,
  onClose,
  onClearCart,
  hasItems,
}) => {
  return (
    <>
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-3 right-3 md:top-4 md:right-4 z-10 w-9 h-9 md:w-10 md:h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all duration-300 ease-out active:scale-95"
      >
        <FaTimes size={18} />
      </button>

      {/* Header */}
      <div className="shrink-0 bg-white border-b border-slate-200 px-4 py-3 md:p-6 flex items-center justify-between safe-area-top">

        {/* Left side */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
            <FaShoppingBag className="text-orange-600" size={20} />
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800">
              Корзина ({totalItems})
            </h2>

            <p className="text-xs md:text-sm text-slate-600 hidden sm:block">
              Ваши выбранные товары
            </p>
          </div>
        </div>

        {/* Clear cart */}
        {hasItems && (
          <button
            onClick={onClearCart}
            className="p-2 md:p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Очистить корзину"
          >
            <FaTrash size={16} />
          </button>
        )}

      </div>
    </>
  );
};