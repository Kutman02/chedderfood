import { EditProductHeader } from "./components/EditProductHeader"
import { EditImageUploader } from "./components/EditImageUploader"
import { EditProductForm } from "./components/EditProductForm"

import { useEditProduct } from "./hooks/useEditProduct"

import type { EditProductModalProps } from "./types/editProduct.types"

export const EditProductModal = ({
  isOpen,
  product,
  onClose
}: EditProductModalProps) => {

  const edit = useEditProduct({
    product,
    onClose,
    isOpen
  })

  if (!isOpen || !product) return null

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-2 md:p-4">

      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col">

        <EditProductHeader
          onClose={edit.handleClose}
        />

        <div className="flex-1 overflow-y-auto">

          <div className="flex flex-col md:flex-row">

            <EditImageUploader
              images={edit.images}
              onSelect={edit.handleImageSelect}
              onRemove={edit.removeImage}
              fileInputRef={edit.fileInputRef}
            />

            <EditProductForm
              edit={edit}
            />

          </div>

        </div>

      </div>

    </div>

  )

}