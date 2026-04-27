import { AddProductModal } from "@/components/dashboard/AddProductModal/AddProductModal"
import { EditProductModal } from "@/components/dashboard/EditProductModal/EditProductModal"
import { OrderDetailsModal } from "@/components/dashboard/OrderDetailsModal/OrderDetailsModal"
import type { Product } from "@/types"

type DashboardOverlaysProps = {
  products: Product[]
  orderDetailsModal: {
    isOpen: boolean
    order: any | null
  }
  showAddProductModal: boolean
  showEditProductModal: boolean
  selectedProduct: Product | null
  onCloseOrderDetails: () => void
  onCloseAddProduct: () => void
  onCloseEditProduct: () => void
}

export const DashboardOverlays = ({
  products,
  orderDetailsModal,
  showAddProductModal,
  showEditProductModal,
  selectedProduct,
  onCloseOrderDetails,
  onCloseAddProduct,
  onCloseEditProduct,
}: DashboardOverlaysProps) => {
  return (
    <>
      <OrderDetailsModal
        isOpen={orderDetailsModal.isOpen}
        order={orderDetailsModal.order}
        products={products}
        onClose={onCloseOrderDetails}
      />

      <AddProductModal
        isOpen={showAddProductModal}
        onClose={onCloseAddProduct}
      />

      <EditProductModal
        isOpen={showEditProductModal}
        product={selectedProduct}
        onClose={onCloseEditProduct}
      />
    </>
  )
}
