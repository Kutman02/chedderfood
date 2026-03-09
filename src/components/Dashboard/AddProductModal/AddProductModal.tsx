

import {
  AddProductHeader,
  ImageUploader,
  ProductForm
} from "@/components/Dashboard/AddProductModal/components"

import { useAddProduct } from "@/components/Dashboard/AddProductModal/hooks/useAddProduct"

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AddProductModal = ({
  isOpen,
  onClose
}: AddProductModalProps) => {

  const product = useAddProduct({ onClose })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-2 md:p-4">

      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col">

        <AddProductHeader onClose={product.handleClose} />

        <div className="flex-1 overflow-y-auto">

          <div className="flex flex-col md:flex-row">

            {/* LEFT — images */}
            <ImageUploader
              images={product.images}
              onSelect={product.handleImageSelect}
              onRemove={product.removeImage}
              fileInputRef={product.fileInputRef}
            />

            {/* RIGHT — form */}
            <ProductForm
              categories={product.categories}

              name={product.name}
              setName={product.setName}

              description={product.description}
              setDescription={product.setDescription}

              regularPrice={product.regularPrice}
              setRegularPrice={product.setRegularPrice}

              salePrice={product.salePrice}
              setSalePrice={product.setSalePrice}

              weight={product.weight}
              setWeight={product.setWeight}

              selectedCategory={product.selectedCategory}
              setSelectedCategory={product.setSelectedCategory}

              isSubmitting={product.isSubmitting}
              images={product.images}

              onSubmit={product.handleSubmit}
            />

          </div>

        </div>

      </div>

    </div>
  )
}