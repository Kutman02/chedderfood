import { useNavigate } from "react-router-dom"
import { useCreateOrderMutation } from "@/api"
import { useAppDispatch } from "@/app/hooks"
import { addReceipt, setCustomerData } from "@/app/slices/receiptsSlice"
import { clearCart } from "@/app/slices/cartSlice"
import { RESTAURANT } from "@/config/restaurant"

export const useCreateOrder = () => {
  const [createOrder] = useCreateOrderMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const create = async ({
    formData,
    cartItems,
    totalAmount,
    orderType,
    onClose,
  }: any) => {

    const orderData = {
      status: "on-hold",
      customer_id: 0,
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
      total: totalAmount.toString(),
      currency: "KGS",
      meta_data: [
        { key: "order_type", value: orderType },
        { key: "pickup_address", value: RESTAURANT.address },
      ],
    }

    const order = await createOrder(orderData).unwrap()

    dispatch(addReceipt(order))
    dispatch(clearCart())

    dispatch(
      setCustomerData({
        first_name: formData.first_name,
        address: formData.address,
        phone: formData.phone,
      })
    )

    onClose()

    navigate(`/?modal=mycheks&order=${order.id}`, { replace: true })

    return order
  }

  return { create }
}