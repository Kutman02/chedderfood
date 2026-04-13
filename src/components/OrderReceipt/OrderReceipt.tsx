import type { FC } from "react"

import type { Product } from "@/types"
import type { Order } from "@/types"
import { useOrderReceipt } from "./hooks/useOrderReceipt"

import { ReceiptHeader } from "./components/ReceiptHeader"
import { CustomerInfo } from "./components/CustomerInfo"
import { OrderTypeBlock } from "./components/OrderTypeBlock"
import { OrderInfo } from "./components/OrderInfo"
import { OrderItemsTable } from "./components/OrderItemsTable"
import { OrderTotals } from "./components/OrderTotals"
import { OrderNote } from "./components/OrderNote"
import { OrderStatus } from "./components/OrderStatus"
import { ReceiptActions } from "./components/ReceiptActions"

interface OrderReceiptProps {
  orderData: Order | null
  products?: Product[]
  onClose: () => void
  onNewOrder: () => void
}

export const OrderReceipt: FC<OrderReceiptProps> = ({
  orderData,
  products,
  onClose,
  onNewOrder,
}) => {

  const receipt = useOrderReceipt(orderData, products)

  const order = receipt.order

  /* ===============================
     🔥 GUARD (ОБЯЗАТЕЛЬНО)
  =============================== */

  if (!order) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="bg-white p-6 rounded-xl">
          <p className="text-slate-600">Загрузка заказа...</p>
        </div>
      </div>
    )
  }

  /* ===============================
     RENDER
  =============================== */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

      <div className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-xl shadow-2xl overflow-hidden flex flex-col">

        <ReceiptHeader
          status={order.status}
          onClose={onClose}
        />

        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-xl mx-auto w-full">

          {/* Restaurant */}
          <div className="text-center border-b border-slate-200 pb-6">

            <h1 className="text-3xl font-black text-slate-900">
              KutMenu
            </h1>

            {order.order_type === "pickup" && (order.pickup_address || order.address) && (
              <p className="text-sm text-slate-500 mt-1">
                Адрес ресторана (самовывоз): {order.pickup_address || order.address}
              </p>
            )}

            <p className="text-orange-600 font-bold mt-3 text-lg">
              Чек заказа
            </p>

          </div>

          <OrderInfo
            order={order}
            formatDate={receipt.formatDate}
            shippingInfo={receipt.shippingInfo}
          />

          <OrderStatus status={order.status} />

          <OrderItemsTable items={receipt.orderItems} />

          <OrderTotals
            subtotal={receipt.subtotal}
            shippingCost={receipt.shippingCost}
            total={receipt.total}
          />

          <OrderTypeBlock order={order} />

          <CustomerInfo order={order} />

          <OrderNote note={order.customer_note} />

        </div>

        <ReceiptActions
          onPrint={receipt.handlePrint}
          onShare={receipt.handleShare}
          onNewOrder={onNewOrder}
        />

      </div>

    </div>
  )
}