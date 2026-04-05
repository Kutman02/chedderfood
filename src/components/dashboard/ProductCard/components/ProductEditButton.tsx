import { FaEdit } from "react-icons/fa"
import type { Product } from "@/entities/product/model/types"

interface Props {
  product: Product
  onEdit: (product: Product) => void
}

export const ProductEditButton = ({
  product,
  onEdit
}: Props) => {

  return (

    <div className="absolute top-2 right-2">

      <button
      aria-label="Редактировать товар"
        onClick={(e) => {
          e.stopPropagation()
          onEdit(product)
        }}
        className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
      >
        <FaEdit className="text-orange-500" size={14}/>
      </button>

    </div>

  )

}