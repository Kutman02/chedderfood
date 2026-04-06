import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "@/app/hooks"

import { addReceipt, setCustomerData } from "@/app/slices/receiptsSlice"
import { clearCart } from "@/app/slices/cartSlice"

import { RESTAURANT } from "@/config/restaurant"

import { useCreateOrderMutation } from "@/api"

import type {
  CreateOrderRequest,
} from "@/types"
import type { CreateOrderInput } from "@/types/ui/order.types"

export const useCreateOrder = () => {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

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

      const order = await createOrder(orderData).unwrap()

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
         NAVIGATION
      ========================= */

      onClose()

      navigate(`/?modal=mycheks&order=${order.id}`, {
        replace: true,
      })

      return order

    } catch (error) {
      console.error("❌ create order error:", error)
      throw error
    }
  }

  return {
    create,
    isLoading,
  }
}