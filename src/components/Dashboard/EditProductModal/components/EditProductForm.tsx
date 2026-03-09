import { FaTag, FaFileAlt } from "react-icons/fa"
import type { UseEditProductReturn } from "../types/editProduct.types"

import { ProductStatusSelector } from "./ProductStatusSelector"
import { VisibilityToggle } from "./VisibilityToggle"
import { PriceFields } from "./PriceFields"
import { WeightField } from "./WeightField"

interface EditProductFormProps {
  edit: UseEditProductReturn
}

export const EditProductForm = ({ edit }: EditProductFormProps) => {

  return (

    <div className="md:w-1/2 p-4 md:p-6">

      <div className="space-y-4 md:space-y-5 max-w-md mx-auto">

        {/* STATUS */}
        <ProductStatusSelector
          value={edit.productStatus}
          onChange={edit.setProductStatus}
        />

        {/* VISIBILITY */}
        <VisibilityToggle
          value={edit.isHidden}
          onChange={edit.setIsHidden}
        />

        {/* CATEGORY */}

        <div>

          <label className="text-sm font-black text-slate-700 mb-2 flex items-center gap-2">
            <FaTag /> Категория *
          </label>

          <select
            value={edit.selectedCategory || ""}
            onChange={(e) => edit.setSelectedCategory(parseInt(e.target.value))}
            className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-orange-500 outline-none font-semibold bg-white"
          >

            <option value="">Выберите категорию</option>

            {edit.categories?.map((cat: { id: number; name: string }) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}

          </select>

        </div>


        {/* NAME */}

        <div>

          <label className="block text-sm font-black text-slate-700 mb-2">
            Название товара *
          </label>

          <input
            type="text"
            value={edit.name}
            onChange={(e) => edit.setName(e.target.value)}
            placeholder="Название товара"
            className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-orange-500 outline-none"
          />

        </div>


        {/* DESCRIPTION */}

        <div>

          <label className="text-sm font-black text-slate-700 mb-2 flex items-center gap-2">
            <FaFileAlt /> Описание
          </label>

          <textarea
            value={edit.description}
            onChange={(e) => edit.setDescription(e.target.value)}
            placeholder="Описание товара..."
            rows={5}
            className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-orange-500 outline-none resize-none"
          />

        </div>


        {/* PRICES */}

        <PriceFields
          regularPrice={edit.regularPrice}
          setRegularPrice={edit.setRegularPrice}
          salePrice={edit.salePrice}
          setSalePrice={edit.setSalePrice}
        />


        {/* WEIGHT */}

        <WeightField
          weight={edit.weight}
          setWeight={edit.setWeight}
        />


        {/* SUBMIT */}

        <button
          onClick={edit.handleSubmit}
          disabled={
            edit.isSubmitting ||
            !edit.name ||
            !edit.selectedCategory ||
            edit.images.length === 0 ||
            !edit.regularPrice
          }
          className="w-full bg-linear-to-r from-orange-500 to-orange-600 text-white py-4 md:py-3 rounded-xl font-black text-base md:text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-4 md:mt-6 active:scale-95"
        >
          {edit.isSubmitting ? "Сохранение..." : "Сохранить изменения"}
        </button>

      </div>

    </div>

  )

}