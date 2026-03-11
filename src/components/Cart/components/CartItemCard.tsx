import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

import type { CartItem } from "@/types";

interface CartItemCardProps {
  item: CartItem;
  onAdd: () => void;
  onRemove: () => void;
  siteUrl: string;
}
export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onAdd,
  onRemove,
  siteUrl,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-3 md:p-4 flex gap-3 md:gap-4 hover:shadow-lg transition-all duration-300 ease-out">

      {/* Image */}
      <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-100 rounded-lg md:rounded-xl overflow-hidden shrink-0">
        <img
          src={item.images?.[0]?.src || "/placeholder-image.jpg"}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `${siteUrl}/wp-content/uploads/2026/02/ChatGPT-Image-10-февр.-2026-г.-10_22_47.png`;
          }}
        />
      </div>

      {/* Product info */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Name */}
        <h3 className="font-bold text-base md:text-lg text-slate-800 mb-1 md:mb-2 line-clamp-2">
          {item.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
          <span className="text-lg md:text-xl font-bold text-orange-600">
            {item.sale_price || item.price} сом
          </span>

          {item.sale_price && item.regular_price && (
            <span className="text-xs md:text-sm text-slate-400 line-through">
              {item.regular_price} сом
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-auto gap-2">

          {/* Quantity */}
          <div className="flex items-center gap-1.5 md:gap-2 bg-orange-50 rounded-lg p-1 md:p-1.5">

            <button
              onClick={onRemove}
              className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-orange-600 text-white rounded-md md:rounded-lg hover:bg-orange-700 transition-colors duration-200 active:scale-95"
            >
              <FaMinus size={12} />
            </button>

            <span className="font-bold text-base md:text-lg text-slate-800 min-w-24px md:min-w-28px text-center">
              {item.quantity}
            </span>

            <button
              onClick={onAdd}
              className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-orange-600 text-white rounded-md md:rounded-lg hover:bg-orange-700 transition-colors duration-200 active:scale-95"
            >
              <FaPlus size={12} />
            </button>

          </div>

          {/* Total */}
          <div className="text-right">
            <div className="font-bold text-base md:text-lg text-slate-800 whitespace-nowrap">
              {(
  parseFloat(item.sale_price || item.price || "0") *
  item.quantity
).toFixed(0)} сом
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};