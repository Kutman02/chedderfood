import React from "react"
import type { RefObject } from "react"
import { FaImage, FaPlus, FaTrash } from "react-icons/fa"

interface ImagePreview {
  file: File
  preview: string
  id: string
}

interface ImageUploaderProps {
  images: ImagePreview[]
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: (id: string) => void
fileInputRef: RefObject<HTMLInputElement | null>}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onSelect,
  onRemove,
  fileInputRef
}) => {

  return (
    <div className="md:w-1/2 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 p-4 md:p-6">

      <div className="sticky top-6">

        <input
          aria-label="Выберите изображения для загрузки"
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

            <p className="text-sm text-slate-500">
              Можно выбрать несколько изображений
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
                aria-label="Удалить главное изображение"
                className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <FaTrash size={14} />
              </button>

            </div>

            {/* THUMBNAILS */}

            {images.length > 1 && (

              <div className="grid grid-cols-4 gap-2">

                {images.slice(1).map(image => (

                  <div key={image.id} className="relative group">

                    <img
                      src={image.preview}
                      alt="Preview"
                      className="w-full h-20 object-cover rounded-lg"
                    />

                    <button
                      onClick={() => onRemove(image.id)}
                      aria-label="Удалить изображение"
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash size={10} />
                    </button>

                  </div>

                ))}

                {images.length < 10 && (

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-lg h-20 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition-colors bg-white"
                  >
                    <FaPlus className="text-slate-400" size={16} />
                  </div>

                )}

              </div>

            )}

            {/* ADD MORE BUTTON */}

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