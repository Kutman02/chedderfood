import type { FC } from "react"

import type { Product, PublicOrder } from "@/types"

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
  orderData: PublicOrder
  products: Product[]
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

  // актуальный заказ
  const currentOrder = receipt.latestOrder ?? receipt.order

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

      <div
        className="
          bg-white
          w-full h-full
          sm:h-auto sm:max-h-[90vh]
          sm:max-w-2xl
          sm:rounded-xl
          shadow-2xl
          overflow-hidden
          flex flex-col
        "
      >

        <ReceiptHeader
          status={currentOrder.status}
          onClose={onClose}
          onRefresh={receipt.handleRefresh}
          isRefreshing={receipt.isRefreshing}
        />

        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-xl mx-auto w-full">

          {/* Restaurant */}
          <div className="text-center border-b border-slate-200 pb-6">

            <h1 className="text-3xl font-black text-slate-900">
              BURGERFOOD
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Курманжан датка 12, Ош, Кыргызстан
            </p>

            <p className="text-orange-600 font-bold mt-3 text-lg">
              Чек заказа
            </p>

          </div>

          {/* Order info */}
          <OrderInfo
            order={currentOrder}
            formatDate={receipt.formatDate}
            shippingInfo={receipt.shippingInfo}
          />

          {/* Status */}
          <OrderStatus
            status={currentOrder.status}
            isUpdated={!!receipt.latestOrder}
          />

          {/* Items */}
          <OrderItemsTable items={receipt.orderItems} />

          {/* Totals */}
          <OrderTotals
            subtotal={receipt.subtotal}
            shippingCost={receipt.shippingCost}
            total={receipt.total}
          />

          {/* Delivery / Pickup */}
          <OrderTypeBlock orderType={receipt.orderType} />

          {/* Customer */}
          <CustomerInfo order={currentOrder} />

          {/* Note */}
          <OrderNote note={currentOrder.customer_note} />

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