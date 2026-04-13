import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "@/app/hooks"
import { useToastStore } from "@/stores/toastStore"

import { addReceipt, setCustomerData } from "@/app/slices/receiptsSlice"
import { clearCart } from "@/app/slices/cartSlice"

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
    pickupAddress,
    pickupMapUrl,
    onClose,
  }: CreateOrderInput) => {

    /* =========================
       MAPPING UI → API
    ========================= */

    const orderData: CreateOrderRequest = {
      status: "on-hold",

      billing: {
        first_name: formData.first_name,
        address_1: orderType === "pickup"
          ? (pickupAddress || undefined)
          : formData.address,
        apartment: formData.apartment,
        floor: formData.floor,
        phone: formData.phone,
      },

      customer_note: formData.customer_note,
      needs_cutlery: formData.needs_cutlery,
      needs_napkins: formData.needs_napkins,

      line_items: cartItems,

      meta_data: [
        { key: "order_type", value: orderType },
        ...(formData.apartment
          ? [{ key: "apartment", value: formData.apartment }]
          : []),
        ...(formData.floor
          ? [{ key: "floor", value: formData.floor }]
          : []),
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
          address: orderType === "pickup" ? pickupAddress || "" : formData.address,
          pickup_address: orderType === "pickup" ? pickupAddress : undefined,
          pickup_map_url: orderType === "pickup" ? pickupMapUrl : undefined,
          apartment: formData.apartment,
          floor: formData.floor,
          customer_note: formData.customer_note,
          order_type: orderType,
          needs_cutlery: formData.needs_cutlery,
          needs_napkins: formData.needs_napkins,
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
          apartment: formData.apartment,
          floor: formData.floor,
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
