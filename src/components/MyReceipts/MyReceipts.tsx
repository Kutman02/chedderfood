import { useReceiptsLogic } from "./hooks"
import { ConfirmDialog } from "../ConfirmDialog/ConfirmDialog"
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
    deleteConfirm,
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
            onDelete={handleDeleteReceipt}
            onView={toggleReceiptDetails}
          />
        )}

      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Удаление заказа"
        message={`Вы действительно хотите удалить заказ #${deleteConfirm.receiptId}?`}
        onConfirm={confirmDeleteReceipt}
        onCancel={cancelDeleteReceipt}
        confirmText="Да"
        cancelText="Нет"
      />

    </div>
  )
}