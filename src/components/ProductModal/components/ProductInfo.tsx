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

  const parsedDescription = description
    ? description
        .replace(/<[^>]*>/g, "")
        .split(",")
        .map((item) => item.trim())
        .join(", ")
    : "Мясо, томатный соус, моцарелла, огурцы маринованные, томаты, лук красный, халапеньо"

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
      <div className="space-y-2">
        <h3 className="font-bold text-lg text-slate-800">
          Описание
        </h3>

        <div className="text-sm text-slate-700">
          {parsedDescription}
        </div>
      </div>

      {/* Кнопка */}
      <div className="pt-4">
        {children}
      </div>

    </div>
  )
}