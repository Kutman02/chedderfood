import React from "react";
import { FaShoppingBag } from "react-icons/fa";

interface CartEmptyProps {
  onClose: () => void;
}

export const CartEmpty: React.FC<CartEmptyProps> = ({ onClose }) => {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 md:py-20">
      <div className="text-center max-w-md">

        {/* Icon */}
        <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 animate-pulse">
          <FaShoppingBag className="text-slate-400" size={36} />
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2 md:mb-3">
          Корзина пуста
        </h3>

        {/* Description */}
        <p className="text-slate-600 mb-6 md:mb-8 text-base md:text-lg">
          Добавьте товары для оформления заказа
        </p>

        {/* Button */}
        <button
          onClick={onClose}
          className="bg-orange-600 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-lg md:rounded-xl font-bold hover:bg-orange-700 transition-all duration-300 ease-out text-base md:text-lg active:scale-95 shadow-lg hover:shadow-xl"
        >
          Перейти к покупкам
        </button>

      </div>
    </div>
  );
};