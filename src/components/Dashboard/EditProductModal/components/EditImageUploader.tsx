import { FaImage, FaPlus, FaTrash } from "react-icons/fa"
import type { RefObject } from "react"
import { EditImagePreviewGrid } from "./EditImagePreviewGrid"
import type { ImagePreview } from "../types/editProduct.types"

interface EditImageUploaderProps {
  images: ImagePreview[]
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: (id: string) => void
  fileInputRef: RefObject<HTMLInputElement | null>
}

export const EditImageUploader = ({
  images,
  onSelect,
  onRemove,
  fileInputRef
}: EditImageUploaderProps) => {

  return (

    <div className="md:w-1/2 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 p-4 md:p-6">

      <div className="sticky top-6">

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={onSelect}
          className="hidden"
        />

        {images.length === 0 ? (

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 rounded-xl p-16 text-center cursor-pointer hover:border-orange-500 transition-colors bg-white"
          >

            <FaImage className="text-5xl text-slate-400 mx-auto mb-4" />

            <p className="text-slate-600 font-black text-lg mb-2">
              Выберите фото
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {/* MAIN IMAGE */}

            <div className="relative group bg-white rounded-xl overflow-hidden shadow-lg">

              <img
                src={images[0].preview}
                alt="Main preview"
                className="w-full h-96 object-cover"
              />

              {images.length > 1 && (

                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-bold">

                  +{images.length - 1} фото

                </div>

              )}

              <button
                onClick={() => onRemove(images[0].id)}
                className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <FaTrash size={14} />
              </button>

            </div>


            {/* GRID PREVIEW */}

            <EditImagePreviewGrid
              images={images}
              onRemove={onRemove}
              fileInputRef={fileInputRef}
            />


            {/* ADD BUTTON */}

            {images.length === 1 && images.length < 10 && (

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-300 rounded-xl py-4 text-center cursor-pointer hover:border-orange-500 transition-colors bg-white font-bold text-slate-600 flex items-center justify-center gap-2"
              >

                <FaPlus />

                Добавить еще фото

              </button>

            )}

          </div>

        )}

      </div>

    </div>

  )

}