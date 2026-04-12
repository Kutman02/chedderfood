import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "@/app/hooks"
import { useToastStore } from "@/stores/toastStore"

import { addReceipt, setCustomerData } from "@/app/slices/receiptsSlice"
import { clearCart } from "@/app/slices/cartSlice"

import { RESTAURANT } from "@/config/restaurant"

import { useCreateOrderMutation } from "@/api"

import type {
  CreateOrderRequest,
  Order,
} from "@/types"
import type { CreateOrderInput } from "@/types/ui/order.types"

/* =========================
   CREATE ORDER HOOK
   Создает заказ и обновляет локальное состояние
========================= */

export const useCreateOrder = () => {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const addToast = useToastStore((state) => state.addToast)

  const [createOrder, { isLoading }] = useCreateOrderMutation()

  const create = async ({
    formData,
    cartItems,
    orderType,
    onClose,
  }: CreateOrderInput) => {

    /* =========================
       MAPPING UI → API
    ========================= */

    const orderData: CreateOrderRequest = {
      status: "on-hold",

      billing: {
        first_name: formData.first_name,
        address_1:
          orderType === "pickup"
            ? RESTAURANT.address
            : formData.address,
        phone: formData.phone,
      },

      customer_note: formData.customer_note,

      line_items: cartItems,

      meta_data: [
        { key: "order_type", value: orderType },
        { key: "pickup_address", value: RESTAURANT.address },
      ],
    }

    try {

      const response = await createOrder(orderData).unwrap()
      const order: Order =
        response.order ?? {
          id: response.id,
          status: response.status,
          total: String(response.total),
          currency: "KGS",
          date_created: new Date().toISOString(),
          customer_name: formData.first_name,
          phone: formData.phone,
          address:
            orderType === "pickup"
              ? RESTAURANT.address
              : formData.address,
          customer_note: formData.customer_note,
          order_type: orderType,
          line_items: [],
          items: [],
        }

      /* =========================
         STATE UPDATES
      ========================= */

      dispatch(addReceipt(order))
      dispatch(clearCart())

      dispatch(
        setCustomerData({
          first_name: formData.first_name,
          address: formData.address,
          phone: formData.phone,
        })
      )

      /* =========================
         NOTIFICATION
      ========================= */

      addToast(
        `Заказ #${order.id} создан успешно! Статус: ${order.status}`,
        "success",
        5000
      )

      /* =========================
         NAVIGATION
      ========================= */

      onClose()

      navigate(`/?modal=mycheks&order=${order.id}`, {
        replace: true,
      })

      return order

    } catch (error) {
      console.error("❌ create order error:", error)
      
      /* =========================
         ERROR NOTIFICATION
      ========================= */
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Ошибка при создании заказа. Пожалуйста, попробуйте позже."
      
      addToast(errorMessage, "error", 5000)
      throw error
    }
  }

  return {
    create,
    isLoading,
  }
}
