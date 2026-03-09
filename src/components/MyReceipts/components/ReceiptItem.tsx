import { useGetPublicOrderQuery } from "@/app/services/publicApi"
import type { ReceiptData } from "@/types"

interface ReceiptItemProps {
  receipt: ReceiptData
  onDelete: (id: number, status: string) => void
  onView: (receipt: ReceiptData) => void
}

export const ReceiptItem = ({
  receipt,
  onDelete,
  onView
}: ReceiptItemProps) => {

  const { data: latestOrder } =
    useGetPublicOrderQuery(receipt.id.toString(), {
      pollingInterval: 15000
    })

  const currentOrderData = latestOrder || receipt

  return (
    <div className="border rounded-xl p-4">

      <h3>Заказ #{receipt.id}</h3>

      <p>Статус: {currentOrderData.status}</p>

      <button
        onClick={() => onView(receipt)}
      >
        Посмотреть
      </button>

      <button
        onClick={() => onDelete(receipt.id, currentOrderData.status)}
      >
        Удалить
      </button>

    </div>
  )
}