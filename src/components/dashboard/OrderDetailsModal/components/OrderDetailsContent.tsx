import type { Order } from "@/types"

import {
  OrderCustomerInfo,
  OrderTypeInfo,
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

      {/* Самое важное — блюда */}
      <OrderItemsList order={order} />

      {/* Комментарий клиента */}
      <OrderNote note={order.customer_note} />

      {/* Тип заказа и адрес */}
      <OrderTypeInfo order={order} />

      {/* Клиент */}
      <OrderCustomerInfo order={order} />


      {/* Оплата */}
      <OrderPaymentInfo order={order} />

      {/* Цена */}
      <OrderPricing order={order} />

    </div>

  )

}