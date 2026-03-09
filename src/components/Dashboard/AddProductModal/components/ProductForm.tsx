import React from "react"
import { FaTag, FaFileAlt, FaDollarSign, FaBox } from "react-icons/fa"

interface Category {
  id: number
  name: string
}

interface ProductFormProps {

  categories?: Category[]

  name: string
  setName: (value: string) => void

  description: string
  setDescription: (value: string) => void

  regularPrice: string
  setRegularPrice: (value: string) => void

  salePrice: string
  setSalePrice: (value: string) => void

  weight: string
  setWeight: (value: string) => void

  selectedCategory: number | null
  setSelectedCategory: (value: number) => void

  isSubmitting: boolean
  images: { id: string }[]

  onSubmit: () => void
}

export const ProductForm: React.FC<ProductFormProps> = ({
  categories,

  name,
  setName,

  description,
  setDescription,

  regularPrice,
  setRegularPrice,

  salePrice,
  setSalePrice,

  weight,
  setWeight,

  selectedCategory,
  setSelectedCategory,

  isSubmitting,
  images,

  onSubmit
}) => {

  return (

    <div className="md:w-1/2 p-4 md:p-6">

      <div className="space-y-4 md:space-y-5 max-w-md mx-auto">

        {/* CATEGORY */}

        <div>

          <label className="text-sm font-black text-slate-700 mb-2 flex items-center gap-2">
            <FaTag /> Категория *
          </label>

          <select
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(parseInt(e.target.value))}
            className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-orange-500 outline-none font-semibold bg-white"
          >

            <option value="">Выберите категорию</option>

            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}

          </select>

        </div>


        {/* NAME */}

        <div>

          <label className="text-sm font-black text-slate-700 mb-2">
            Название товара *
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например: Шаурма классическая"
            className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-orange-500 outline-none"
          />

        </div>


        {/* DESCRIPTION */}

        <div>

          <label className="text-sm font-black text-slate-700 mb-2 flex items-center gap-2">
            <FaFileAlt /> Описание
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Расскажите о товаре..."
            rows={5}
            className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-orange-500 outline-none resize-none"
          />

        </div>


        {/* PRICES */}

        <div className="grid grid-cols-2 gap-4">

          <div>

            <label className="text-sm font-black text-slate-700 mb-2 flex items-center gap-2">
              <FaDollarSign /> Цена (сом) *
            </label>

            <input
              type="number"
              value={regularPrice}
              onChange={(e) => setRegularPrice(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-orange-500 outline-none"
            />

          </div>

          <div>

            <label className="text-sm font-black text-slate-700 mb-2">
              Цена со скидкой
            </label>

            <input
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-orange-500 outline-none"
            />

          </div>

        </div>


        {/* WEIGHT */}

        <div>

          <label className="text-sm font-black text-slate-700 mb-2 flex items-center gap-2">
            <FaBox /> Вес (граммы)
          </label>

          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="0"
            min="0"
            step="1"
            className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-orange-500 outline-none"
          />

          <p className="text-xs text-slate-500 mt-1">
            Укажите вес товара (необязательно)
          </p>

        </div>


        {/* SUBMIT */}

        <button
          onClick={onSubmit}
          disabled={
            isSubmitting ||
            !name ||
            !selectedCategory ||
            images.length === 0 ||
            !regularPrice
          }
          className="w-full bg-linear-to-r from-orange-500 to-orange-600 text-white py-4 md:py-3 rounded-xl font-black text-base md:text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-4 md:mt-6 active:scale-95"
        >

          {isSubmitting ? "Публикация..." : "Опубликовать"}

        </button>

      </div>

    </div>

  )

}