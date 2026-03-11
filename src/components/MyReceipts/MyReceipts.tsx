import { useReceiptsLogic } from "./hooks"
import { ConfirmDialog } from "../ConfirmDialog/ConfirmDialog"
import { OrderReceipt } from "../OrderReceipt/OrderReceipt"
import type { Product } from "@/types"
import { ReceiptsHeader, ReceiptsList, EmptyReceipts } from "./components"

interface MyReceiptsProps {
  products: Product[]
  onClose: () => void
}

export const MyReceipts = ({ products, onClose }: MyReceiptsProps) => {

  const {
    receipts,
    selectedReceipt,
    deleteConfirm,
    setSelectedReceipt,
    confirmDeleteReceipt,
    cancelDeleteReceipt,
    handleDeleteReceipt
  } = useReceiptsLogic()

  if (selectedReceipt) {
    return (
      <OrderReceipt
        orderData={selectedReceipt}
        products={products}
        onClose={() => setSelectedReceipt(null)}
        onNewOrder={() => setSelectedReceipt(null)}
      />
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col h-screen">

      <ReceiptsHeader onClose={onClose} />

      <div className="flex-1 overflow-y-auto p-6">

        {receipts.length === 0 ? (
          <EmptyReceipts onClose={onClose} />
        ) : (
          <ReceiptsList
            receipts={receipts}
            onDelete={handleDeleteReceipt}
            onView={setSelectedReceipt}
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