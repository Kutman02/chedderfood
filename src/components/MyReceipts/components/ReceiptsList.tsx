import { ReceiptItem } from "./ReceiptItem"
import type { ReceiptData } from "@/types"
import type { Product } from "@/types"

interface ReceiptsListProps {
  receipts: ReceiptData[]
  products: Product[]
  expandedReceiptId: number | null
  onDelete: (id: number, status: string) => void
  onView: (receipt: ReceiptData) => void
}

export const ReceiptsList = ({
  receipts,
  products,
  expandedReceiptId,
  onDelete,
  onView
}: ReceiptsListProps) => {

  if (!receipts.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">📄</div>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Заказов пока нет
        </h2>

        <p className="text-gray-500 max-w-sm">
          Когда клиент сделает заказ, он появится здесь.
        </p>
      </div>
    )
  }

  return (
    <section className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        {/* <h2 className="text-2xl font-semibold text-gray-900">
          Заказы
        </h2> */}

        <span className="text-sm text-gray-500">
          Всего: {receipts.length}
        </span>
      </div>

      {/* Grid */}
      <div className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        xl:grid-cols-4 
        gap-5
      ">
        {receipts.map((receipt) => (
          <div
            key={receipt.id}
            className={expandedReceiptId === receipt.id ? "sm:col-span-2 lg:col-span-3 xl:col-span-4" : ""}
          >
            <ReceiptItem
              receipt={receipt}
              products={products}
              isDetailsOpen={expandedReceiptId === receipt.id}
              onDelete={onDelete}
              onView={onView}
            />
          </div>
        ))}
      </div>

    </section>
  )
}