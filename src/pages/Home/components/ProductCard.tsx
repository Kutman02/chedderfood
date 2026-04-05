import { FaPlus, FaMinus } from "react-icons/fa";
import type { Product } from "@/entities/product/model/types";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
} from "../../../app/slices/cartSlice";

import { getProductStatus } from "../utils/getProductStatus";

interface ProductCardProps {
  product: Product;
  productIndex: number;
  onClick: () => void;
}

export const ProductCard = ({
  product,
  productIndex,
  onClick,
}: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((s) => s.cart.items);

  /* =========================
     CART
  ========================= */

const cartCount = cart[product.id]?.quantity || 0;
  const handleAddToCart = () => {
    dispatch(addToCartAction(product));
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCartAction(product.id));
  };

  /* =========================
     DATA SAFE (Store API)
  ========================= */

  const productImage =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0].src
      : "/placeholder-image.jpg";

  const productPrice = product.sale_price || product.price || "0";

  const productTags = Array.isArray(product.tags)
    ? product.tags.slice(0, 2)
    : [];

  const isOutOfStock = product.stock_status === "outofstock";

  const productStatus = getProductStatus(product);
  const StatusIcon = productStatus?.icon;

  /* =========================
     DISCOUNT
  ========================= */

  let discountPercent: number | null = null;

  if (product.sale_price && product.regular_price) {
    const regular = parseFloat(product.regular_price);
    const sale = parseFloat(product.sale_price);

    if (
      Number.isFinite(regular) &&
      regular > 0 &&
      Number.isFinite(sale) &&
      sale < regular
    ) {
      discountPercent = Math.round((1 - sale / regular) * 100);
    }
  }

  const staggerClass = `animate-stagger-${(productIndex % 4) + 1}`;

  /* =========================
     RENDER
  ========================= */

  return (
    <div
      className={`shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 ${staggerClass} transition-all`}
      onClick={onClick}
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-square bg-slate-100 overflow-hidden rounded-2xl shadow-md">
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {(discountPercent !== null || productStatus || isOutOfStock) && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {productStatus && (
              <div
                className={`bg-linear-to-r ${productStatus.color} text-white px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1`}
              >
                {StatusIcon && <StatusIcon size={10} />}
                {productStatus.label}
              </div>
            )}

            {discountPercent !== null && !productStatus && (
              <div className="bg-green-600 text-white px-2 py-1 rounded text-[11px] font-bold">
                Скидка -{discountPercent}%
              </div>
            )}

            {isOutOfStock && (
              <div className="bg-red-600 text-white px-2 py-1 rounded text-[11px] font-bold">
                Нет в наличии
              </div>
            )}
          </div>
        )}

        {/* CART BUTTON */}
        <div
          className="absolute bottom-2 right-2"
          onClick={(e) => e.stopPropagation()}
        >
          {cartCount === 0 ? (
            <div
              className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition cursor-pointer"
              onClick={handleAddToCart}
            >
              <FaPlus className="text-orange-500" size={14} />
            </div>
          ) : (
            <div className="bg-white rounded-full shadow-md flex items-center gap-1 px-1 py-1">
              <button
                onClick={handleRemoveFromCart}
                aria-label=" Remove from cart"
                className="w-6 h-6 flex items-center justify-center hover:bg-orange-50 rounded-full"
              >
                <FaMinus className="text-orange-500" size={10} />
              </button>

              <span className="text-sm font-bold text-black min-w-5 text-center">
                {cartCount}
              </span>

              <button
                onClick={handleAddToCart}
                aria-label="Add to cart"
                className="w-6 h-6 flex items-center justify-center hover:bg-orange-50 rounded-full"
              >
                <FaPlus className="text-orange-500" size={10} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-3">
        {/* PRICE */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl font-bold text-orange-500">
            {productPrice} сом
          </span>

          {product.sale_price && product.regular_price && (
            <span className="text-sm text-slate-400 line-through">
              {product.regular_price} сом
            </span>
          )}
        </div>

        {/* TITLE */}
        <h3 className="font-bold text-sm text-black mb-1 line-clamp-2">
          {product.name}
        </h3>

        {/* TAGS */}
        {productTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
            {productTags.map((tag) => (
              <span
                key={tag.id}
                className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* META */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {product.weight && <span>{product.weight} г</span>}

          {product.categories && product.categories.length > 0 && (
            <span>
              {product.weight ? "• " : ""}
              {product.categories[0].name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};