import { useReceiptsLogic } from "./hooks"
import type { Product } from "@/types"
import { ReceiptsHeader, ReceiptsList, EmptyReceipts } from "./components"

interface MyReceiptsProps {
  products: Product[]
  onClose: () => void
}

export const MyReceipts = ({ products, onClose }: MyReceiptsProps) => {

  const {
    receipts,
    expandedReceiptId,
    deleteConfirmReceiptId,
    toggleReceiptDetails,
    confirmDeleteReceipt,
    cancelDeleteReceipt,
    handleDeleteReceipt
  } = useReceiptsLogic()

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col h-screen">

      <ReceiptsHeader onClose={onClose} />

      <div className="flex-1 overflow-y-auto p-6">

        {receipts.length === 0 ? (
          <EmptyReceipts onClose={onClose} />
        ) : (
          <ReceiptsList
            receipts={receipts}
            products={products}
            expandedReceiptId={expandedReceiptId}
            deleteConfirmReceiptId={deleteConfirmReceiptId}
            onDelete={handleDeleteReceipt}
            onConfirmDelete={confirmDeleteReceipt}
            onCancelDelete={cancelDeleteReceipt}
            onView={toggleReceiptDetails}
          />
        )}

      </div>

    </div>
  )
}