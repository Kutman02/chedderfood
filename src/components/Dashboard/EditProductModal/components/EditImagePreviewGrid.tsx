import { FaPlus, FaTrash } from "react-icons/fa"
import type { RefObject } from "react"
import type { ImagePreview } from "../types/editProduct.types"

interface EditImagePreviewGridProps {
  images: ImagePreview[]
  onRemove: (id: string) => void
  fileInputRef: RefObject<HTMLInputElement | null>
}

export const EditImagePreviewGrid = ({
  images,
  onRemove,
  fileInputRef
}: EditImagePreviewGridProps) => {

  if (images.length <= 1) return null

  return (

    <div className="grid grid-cols-4 gap-2">

      {images.slice(1).map((image) => (

        <div key={image.id} className="relative group">

          <img
            src={image.preview}
            alt="Preview"
            className="w-full h-20 object-cover rounded-lg"
          />

          <button
            onClick={() => onRemove(image.id)}
            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FaTrash size={10} />
          </button>

        </div>

      ))}

      {/* ADD IMAGE */}

      {images.length < 10 && (

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-lg h-20 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition-colors bg-white"
        >

          <FaPlus className="text-slate-400" size={16} />

        </div>

      )}

    </div>

  )

}