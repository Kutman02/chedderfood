import React from "react"
import { FaFileAlt } from "react-icons/fa"
import type { Tag } from "@/types"
import { ProductTagSelector } from "@/components/dashboard/ProductTagSelector"
import { useProductFormCombo } from "../hooks/useProductFormCombo"
import type { ProductCategory } from "../types/addProduct.types"
import { ComboItemsEditor } from "./ComboItemsEditor"
import { PriceFields } from "./PriceFields"
import { ProductCategoryField } from "./ProductCategoryField"
import { ProductSubmitButton } from "./ProductSubmitButton"
import { WeightField } from "./WeightField"

interface ProductFormProps {
  categories?: ProductCategory[]
  tags?: Tag[]

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

  topTagId: number | null
  setTopTagId: (value: number | null) => void

  bottomTagIds: number[]
  setBottomTagIds: React.Dispatch<React.SetStateAction<number[]>>

  isSubmitting: boolean
  images: { id: string }[]

  onSubmit: (description?: string) => void
}

export const ProductForm: React.FC<ProductFormProps> = ({
  categories,
  tags,
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
  topTagId,
  setTopTagId,
  bottomTagIds,
  setBottomTagIds,
  isSubmitting,
  images,
  onSubmit
}) => {
  const {
    isCombo,
    setIsCombo,
    comboItems,
    addComboItem,
    updateComboItem,
    removeComboItem,
    buildDescriptionWithCombo,
  } = useProductFormCombo()

  const handleSubmit = () => {
    const finalDescription = buildDescriptionWithCombo(description)
    onSubmit(finalDescription)
  }

  return (

    <div className="md:w-1/2 p-4 md:p-6">

      <div className="space-y-4 md:space-y-5 max-w-md mx-auto">

        <ProductCategoryField
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <ProductTagSelector
          label="Верхняя метка"
          helperText="Скидка ставится автоматически по цене со скидкой. Здесь можно выбрать еще 1 верхнюю метку."
          tags={tags}
          selectedTagIds={topTagId ? [topTagId] : []}
          maxSelected={1}
          onChange={(updater) => {
            const previous = topTagId ? [topTagId] : []
            const next =
              typeof updater === "function"
                ? updater(previous)
                : updater

            const nextTopTagId = next[0] ?? null
            setTopTagId(nextTopTagId)
            setBottomTagIds((prev) =>
              nextTopTagId ? prev.filter((id) => id !== nextTopTagId) : prev
            )
          }}
        />

        <ProductTagSelector
          label="Нижние метки"
          helperText="Например: острый, сладкий, веган и т.д."
          tags={tags}
          selectedTagIds={bottomTagIds}
          onChange={(updater) => {
            setBottomTagIds((prev) => {
              const next = typeof updater === "function" ? updater(prev) : updater

              if (!topTagId) return next

              return next.filter((id) => id !== topTagId)
            })
          }}
        />


        {/* NAME */}
        <div>

          <label className="text-sm font-black text-slate-700 mb-2">
            Название товара *
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например: Комбо бургер"
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
            placeholder="Описание товара..."
            rows={4}
            className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-orange-500 outline-none resize-none"
          />

        </div>

        <ComboItemsEditor
          isCombo={isCombo}
          onToggleCombo={() => setIsCombo(!isCombo)}
          comboItems={comboItems}
          onComboItemChange={updateComboItem}
          onComboItemRemove={removeComboItem}
          onComboItemAdd={addComboItem}
        />


        <PriceFields
          regularPrice={regularPrice}
          setRegularPrice={setRegularPrice}
          salePrice={salePrice}
          setSalePrice={setSalePrice}
        />


        <WeightField
          weight={weight}
          setWeight={setWeight}
          showHint={false}
        />


        <ProductSubmitButton
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          disabled={
            isSubmitting ||
            !name ||
            !selectedCategory ||
            images.length === 0 ||
            !regularPrice
          }
        />

      </div>

    </div>

  )
}