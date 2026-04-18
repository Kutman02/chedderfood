import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "@/app/hooks"
import { useToastStore } from "@/stores/toastStore"

import { addReceipt, setCustomerData } from "@/app/slices/receiptsSlice"
import { clearCart } from "@/app/slices/cartSlice"
import { STORAGE_KEYS } from "@/shared/constants/storage"

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

  const normalizeLineItems = (
    items: Array<{ product_id: number; quantity: number }>
  ): CreateOrderRequest["line_items"] => {
    const map = new Map<number, number>()

    for (const item of items) {
      const productId = Number(item.product_id)
      const quantity = Number(item.quantity)

      if (!Number.isInteger(productId) || productId <= 0) continue
      if (!Number.isInteger(quantity) || quantity <= 0) continue

      map.set(productId, (map.get(productId) || 0) + quantity)
    }

    return Array.from(map.entries()).map(([product_id, quantity]) => ({
      product_id,
      quantity,
    }))
  }

  const extractApiErrorMessage = (error: unknown): string => {
    if (error && typeof error === "object" && "data" in error) {
      const data = (error as { data?: unknown }).data

      if (typeof data === "string") return data

      if (data && typeof data === "object" && "message" in data) {
        const message = (data as { message?: unknown }).message
        if (typeof message === "string" && message.trim()) {
          return message
        }
      }
    }

    if (error instanceof Error && error.message.trim()) {
      return error.message
    }

    return "Ошибка при создании заказа. Пожалуйста, попробуйте позже."
  }

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

    const metaData: NonNullable<CreateOrderRequest["meta_data"]> = [
      { key: "order_type", value: orderType },
    ]

    if (formData.apartment_office?.trim()) {
      metaData.push({
        key: "apartment_office",
        value: formData.apartment_office.trim(),
      })
    }

    if (formData.floor?.trim()) {
      metaData.push({
        key: "floor",
        value: formData.floor.trim(),
      })
    }

    metaData.push({
      key: "needs_cutlery_and_napkins",
      value: formData.needs_cutlery_and_napkins ? "1" : "0",
    })

    const normalizedLineItems = normalizeLineItems(cartItems)

    if (normalizedLineItems.length === 0) {
      const invalidItemsMessage =
        "В корзине нет валидных товаров для заказа. Пожалуйста, обновите корзину."
      addToast(invalidItemsMessage, "error", 5000)
      throw { data: { message: invalidItemsMessage } }
    }

    const orderData: CreateOrderRequest = {
      status: "on-hold",

      billing: {
        first_name: formData.first_name,
        address_1: orderType === "pickup"
          ? (pickupAddress || undefined)
          : formData.address,
        apartment_office: formData.apartment_office,
        floor: formData.floor,
        phone: formData.phone,
      },

      customer_note: formData.customer_note,
      needs_cutlery_and_napkins: formData.needs_cutlery_and_napkins,

      line_items: normalizedLineItems,

      meta_data: metaData,
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
          apartment_office: formData.apartment_office,
          floor: formData.floor,
          customer_note: formData.customer_note,
          order_type: orderType,
          needs_cutlery_and_napkins: formData.needs_cutlery_and_napkins,
          line_items: [],
          items: [],
        }

      /* =========================
         STATE UPDATES
      ========================= */

      dispatch(addReceipt(order))
      dispatch(clearCart())

      try {
        localStorage.removeItem(STORAGE_KEYS.CART)
      } catch {
        // noop: cart is already cleared in redux, storage cleanup is best-effort
      }

      dispatch(
        setCustomerData({
          first_name: formData.first_name,
          address: formData.address,
          phone: formData.phone,
          apartment_office: formData.apartment_office,
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
      
      const errorMessage = extractApiErrorMessage(error)

      if (errorMessage.toLowerCase().includes("no valid items found")) {
        dispatch(clearCart())
      }
      
      addToast(errorMessage, "error", 5000)
      throw error
    }
  }

  return {
    create,
    isLoading,
  }
}
