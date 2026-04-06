import { FaTimes } from "react-icons/fa"
import type { Product } from "@/types"

interface ProductInfoProps {
  product: Product
  onClose: () => void
}

export const ProductInfo = ({ product, onClose }: ProductInfoProps) => {

  const productPrice = product.sale_price || product.price || "0"

  const formatWeight = (weight: string | number) => {
    const value = typeof weight === "string" ? parseFloat(weight) : weight

    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)} кг`
    }

    return `${value} г`
  }

  /* =========================
     CLEAN DESCRIPTION
  ========================= */

  const cleanDescription = product.description
    ? product.description
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>|<\/div>/gi, "\n")
        .replace(/<[^>]*>/g, "")
        .trim()
    : ""

  const lines = cleanDescription
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)

  const comboItems = lines
    .filter(line => line.startsWith("•"))
    .map(line => line.replace("•", "").trim())

  const normalDescription = lines
    .filter(
      line =>
        !line.startsWith("•") &&
        !line.toLowerCase().includes("состав комбо")
    )
    .join(" ")

  const isCombo = comboItems.length > 0

  return (
    <>
      {/* CLOSE */}
      <button
      aria-label="Закрыть"
        onClick={onClose}
        className="hidden md:block self-end p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors rounded-lg mb-2"
      >
        <FaTimes size={20} />
      </button>

      {/* TITLE */}
      <h2 className="hidden md:block text-2xl font-black text-slate-800 mb-4">
        {product.name}
      </h2>

      <div className="flex-1 space-y-4">

        {/* PRICE */}
        <div className="flex items-center gap-3">

          <span className="text-2xl font-black text-orange-600">
            {productPrice} сом
          </span>

          {product.sale_price && product.regular_price && (
            <span className="text-lg text-slate-400 line-through">
              {product.regular_price} сом
            </span>
          )}

        </div>


        {/* WEIGHT */}
        {product.weight && (
          <div className="text-sm text-slate-600 font-medium">
            Вес: {formatWeight(product.weight)}
          </div>
        )}


        {/* DESCRIPTION */}
        {(normalDescription || isCombo) && (

          <div className="space-y-2">

            <h3 className="font-bold text-lg text-slate-800">
              Описание
            </h3>

            {normalDescription && (
              <p className="text-slate-700 text-sm">
                {normalDescription}
              </p>
            )}

            {isCombo && (
              <ul className="text-slate-700 text-sm list-disc pl-5 space-y-1">
                {comboItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}

          </div>

        )}

      </div>
    </>
  )
}