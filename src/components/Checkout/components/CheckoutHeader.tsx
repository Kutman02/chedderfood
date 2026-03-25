import React from "react";
import { FaTimes, FaArrowLeft } from "react-icons/fa";

interface CheckoutHeaderProps {
  onClose: () => void;
  onBack: () => void;
  onAutoFill: () => void;
}

export const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({
  onClose,
  onBack,
  onAutoFill,
}) => {
  return (
    <>
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Закрыть"
        className="fixed top-3 right-3 md:top-4 md:right-4 z-10 w-9 h-9 md:w-10 md:h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all active:scale-95"
      >
        <FaTimes size={18} />
      </button>

      {/* Header */}
      <div className="shrink-0 bg-white border-b border-slate-200 px-4 py-3 md:p-6 flex items-center justify-between">

        {/* Left side */}
        <div className="flex items-center gap-3">

          <button
            onClick={onBack}
            aria-label="Назад"
            className="p-2 md:p-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors active:scale-95"
          >
            <FaArrowLeft size={16} />
          </button>

          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800">
              Оформление заказа
            </h2>

            <p className="text-xs md:text-sm text-slate-600 hidden sm:block">
              Заполните данные для доставки
            </p>
          </div>

        </div>

        {/* Autofill button */}
        <button
          onClick={onAutoFill}
          className="px-3 py-1.5 md:px-4 md:py-2 bg-orange-100 text-orange-700 rounded-lg font-medium hover:bg-orange-200 transition-colors text-xs md:text-sm active:scale-95"
        >
          Автозаполнение
        </button>

      </div>
    </>
  );
};