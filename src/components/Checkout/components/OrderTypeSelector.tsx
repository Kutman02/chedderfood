import React from "react";
import { FaShoppingBag, FaBoxOpen } from "react-icons/fa";

interface OrderTypeSelectorProps {
  value: "delivery" | "pickup";
  onChange: (type: "delivery" | "pickup") => void;
}

export const OrderTypeSelector: React.FC<OrderTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700 mb-3 block">
        Способ получения *
      </label>

      <div className="flex gap-3">

        {/* Delivery */}
        <button
          type="button"
          onClick={() => onChange("delivery")}
          className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${
            value === "delivery"
              ? "bg-blue-600 text-white shadow-md scale-105"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <FaShoppingBag size={16} />
            Доставка
          </div>
        </button>

        {/* Pickup */}
        <button
          type="button"
          onClick={() => onChange("pickup")}
          className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${
            value === "pickup"
              ? "bg-green-600 text-white shadow-md scale-105"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <FaBoxOpen size={16} />
            Самовывоз
          </div>
        </button>

      </div>
    </div>
  );
};