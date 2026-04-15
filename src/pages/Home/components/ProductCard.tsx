import { FaPlus, FaMinus } from "react-icons/fa"
import type { Product } from "@/types"
import { isSaleTag, isTopPlacementTag } from "@/shared/utils/tagPlacement"

import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
} from "../../../app/slices/cartSlice"

interface ProductCardProps {
  product: Product
  productIndex: number
  onClick: () => void
}

const normalizeTagValue = (value?: string) => (value ?? "").toLowerCase().trim()

const getBottomTagClassName = (tag: { slug?: string; name: string }) => {
  const value = `${normalizeTagValue(tag.slug)} ${normalizeTagValue(tag.name)}`

  if (value.includes("остр") || value.includes("spicy") || value.includes("hot")) {
    return "bg-red-100 text-red-700"
  }

  if (value.includes("слад") || value.includes("sweet")) {
    return "bg-pink-100 text-pink-700"
  }

  if (value.includes("вег") || value.includes("vegan") || value.includes("veg")) {
    return "bg-emerald-100 text-emerald-700"
  }

  return "bg-slate-100 text-slate-700"
}

export const ProductCard = ({
  product,
  productIndex,
  onClick,
}: ProductCardProps) => {

  const dispatch = useAppDispatch()
  const cart = useAppSelector((s) => s.cart.items)

  /* =========================
     CART
  ========================= */

  const cartCount = cart[product.id]?.quantity || 0

  const handleAddToCart = () => {
    dispatch(addToCartAction(product))
  }

  const handleRemoveFromCart = () => {
    dispatch(removeFromCartAction(product.id))
  }

  /* =========================
     IMAGE (🔥 FIX ГЛАВНЫЙ)
  ========================= */

  const getProductImage = (product: Product) => {
    let img = product.images?.[0]?.src

    if (typeof img === "string" && img.trim() !== "") {
      // 🔥 фикс для "//image.jpg"
      if (img.startsWith("//")) {
        img = "https:" + img
      }
      return img
    }

    return "/placeholder-image.jpg"
  }

  const productImage = getProductImage(product)

  /* =========================
     DATA SAFE
  ========================= */

  const productPrice = product.sale_price || product.price || "0"

  const extraTopTag = Array.isArray(product.tags)
    ? product.tags.find((tag) => isTopPlacementTag(tag) && !isSaleTag(tag))
    : undefined

  const productTags = Array.isArray(product.tags)
    ? product.tags
        .filter((tag) => !isSaleTag(tag))
        .filter((tag) => tag.id !== extraTopTag?.id)
        .slice(0, 3)
    : []

  const isOutOfStock = product.stock_status === "outofstock"

  /* =========================
     DISCOUNT
  ========================= */

  let discountPercent: number | null = null

  if (product.sale_price && product.regular_price) {
    const regular = parseFloat(product.regular_price)
    const sale = parseFloat(product.sale_price)

    if (
      Number.isFinite(regular) &&
      regular > 0 &&
      Number.isFinite(sale) &&
      sale < regular
    ) {
      discountPercent = Math.round((1 - sale / regular) * 100)
    }
  }

  const staggerClass = `animate-stagger-${(productIndex % 4) + 1}`

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
          loading="lazy" // 🔥 оптимизация
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {(discountPercent !== null || isOutOfStock || extraTopTag) && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">

            {discountPercent !== null && (
              <div className="bg-green-600 text-white px-2 py-1 rounded text-[11px] font-bold">
                Скидка -{discountPercent}%
              </div>
            )}

            {isOutOfStock && (
              <div className="bg-red-600 text-white px-2 py-1 rounded text-[11px] font-bold">
                Нет в наличии
              </div>
            )}

            {extraTopTag && (
              <div className="bg-blue-600 text-white px-2 py-1 rounded text-[11px] font-bold">
                {extraTopTag.name}
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
            <button
              type="button"
              className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition cursor-pointer"
              onClick={handleAddToCart}
              aria-label="Добавить в корзину"
            >
              <FaPlus className="text-orange-500" size={14} />
            </button>
          ) : (
            <div className="bg-white rounded-full shadow-md flex items-center gap-1 px-1 py-1">

              <button
                onClick={handleRemoveFromCart}
                aria-label="Удалить из корзины"
                className="w-6 h-6 flex items-center justify-center hover:bg-orange-50 rounded-full"
              >
                <FaMinus className="text-orange-500" size={10} />
              </button>

              <span className="text-sm font-bold text-black min-w-20px text-center">
                {cartCount}
              </span>

              <button
                onClick={handleAddToCart}
                aria-label="Добавить в корзину"
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
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getBottomTagClassName(tag)}`}
              >
                {tag.name}
              </span>
            ))}

          </div>
        )}

        {/* META */}
        <div className="flex items-center gap-2 text-xs text-slate-500">

          {product.weight && <span>{product.weight} г</span>}

          {product.categories?.length > 0 && (
            <span>
              {product.weight ? "• " : ""}
              {product.categories[0].name}
            </span>
          )}

        </div>

      </div>

    </div>
  )
}