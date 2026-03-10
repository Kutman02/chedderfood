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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
<div className="
  bg-white 
  w-full h-full 
  sm:h-auto sm:max-h-[90vh] 
  sm:max-w-2xl 
  sm:rounded-md 
  shadow-2xl 
  overflow-hidden 
  flex flex-col
">        <ReceiptHeader
          onClose={onClose}
          onRefresh={receipt.handleRefresh}
          isRefreshing={receipt.isRefreshing}
        />

        <div className="flex-1 overflow-y-auto p-6">

          <div className="text-center mb-8 border-b-2 border-slate-200 pb-6">
            <h1 className="text-2xl font-black text-slate-800 mb-2">
              BURGERFOOD
            </h1>
            <p className="text-slate-600">
              Курманжан датка 12, Ош, Кыргызстан
            </p>
            <p className="text-lg font-bold text-orange-600 mt-2">
              СЧЕТ
            </p>
          </div>
          <OrderItemsTable items={receipt.orderItems} />

          <CustomerInfo order={receipt.order} />

          <OrderTypeBlock orderType={receipt.orderType} />

          <OrderInfo
            order={receipt.order}
            formatDate={receipt.formatDate}
            shippingInfo={receipt.shippingInfo}
          />


          <OrderTotals
            subtotal={receipt.subtotal}
            shippingCost={receipt.shippingCost}
            total={receipt.total}
          />

          <OrderNote note={receipt.order.customer_note} />

          <OrderStatus
            status={receipt.order.status}
            latestOrder={receipt.latestOrder}
          />

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