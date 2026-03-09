import { ReceiptItem } from "./ReceiptItem"
import type { ReceiptData } from "../../../types"

interface ReceiptsListProps {
  receipts: ReceiptData[]
  onDelete: (id: number, status: string) => void
  onView: (receipt: ReceiptData) => void
}

export const ReceiptsList = ({
  receipts,
  onDelete,
  onView
}: ReceiptsListProps) => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {receipts.map((receipt) => (
        <ReceiptItem
          key={receipt.id}
          receipt={receipt}
          onDelete={onDelete}
          onView={onView}
        />
      ))}

    </div>
  )
}