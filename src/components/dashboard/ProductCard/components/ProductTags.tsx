import type { Product } from "@/types"

export const ProductTags = ({ product }: { product: Product }) => {

  const tags = Array.isArray(product.tags)
    ? product.tags.slice(0, 2)
    : []

  if (tags.length === 0) return null

  return (

    <div className="flex flex-wrap gap-1 mb-1">

      {tags.map((tag: any, index: number) => {

        const key = tag?.id ?? `${tag?.name}-${index}`
        const name = tag?.name || "Тег"

        return (
          <span
            key={key}
            className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold"
          >
            {name}
          </span>
        )
      })}

    </div>

  )

}