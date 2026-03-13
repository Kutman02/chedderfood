import React from "react"

interface ProductInfoProps {
  description?: string
  price: string
  salePrice?: string
  regularPrice?: string
  children: React.ReactNode
}

export const ProductInfo = ({
  description,
  price,
  salePrice,
  regularPrice,
  children,
}: ProductInfoProps) => {

  const cleanDescription = description
    ? description
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
    .filter(line => !line.startsWith("•") && !line.toLowerCase().includes("состав комбо"))
    .join(" ")

  const isCombo = comboItems.length > 0

  return (
    <div className="p-6 space-y-4">

      {/* Цена */}
      <div className="flex items-center gap-3">

        <span className="text-2xl font-black text-orange-600">
          {price} сом
        </span>

        {salePrice && regularPrice && (
          <span className="text-lg text-slate-400 line-through">
            {regularPrice} сом
          </span>
        )}

      </div>


      {/* Описание */}
      {(normalDescription || isCombo) && (

        <div className="space-y-2">

          <h3 className="font-bold text-lg text-slate-800">
            Описание
          </h3>

          {normalDescription && (
            <p className="text-sm text-slate-700">
              {normalDescription}
            </p>
          )}

          {isCombo && (
            <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
              {comboItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}

        </div>

      )}


      {/* Кнопка */}
      <div className="pt-4">
        {children}
      </div>

    </div>
  )
}