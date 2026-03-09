import type { Order } from "@/types"

import {
  OrderCustomerInfo,
  OrderTypeInfo,
  OrderAddressInfo,
  OrderItemsList,
  OrderPricing,
  OrderPaymentInfo,
  OrderNote
} from "./index"

interface Props {
  order: Order
}

export const OrderDetailsContent = ({ order }: Props) => {

  return (

    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

      <OrderCustomerInfo order={order} />

      <OrderTypeInfo order={order} />

      <OrderAddressInfo order={order} />

      <OrderItemsList order={order} />

      <OrderPricing order={order} />

      <OrderPaymentInfo order={order} />

      <OrderNote order={order} />

    </div>

  )

}