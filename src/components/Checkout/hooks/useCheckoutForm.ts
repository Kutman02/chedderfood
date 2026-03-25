import { useState } from "react"
import type { CheckoutFormData } from "@/types"
import { useEffect } from "react"

export const useCheckoutForm = () => {
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery")

 const [formData, setFormData] = useState<CheckoutFormData>(() => {
  try {
    const saved = localStorage.getItem("checkout_form")
    return saved
      ? JSON.parse(saved)
      : {
          first_name: "",
          address: "",
          phone: "",
          customer_note: "",
        }
  } catch {
    return {
      first_name: "",
      address: "",
      phone: "",
      customer_note: "",
    }
  }
})

  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({})

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name as keyof CheckoutFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = (phoneNumber: string) => {
    const newErrors: Partial<CheckoutFormData> = {}

    if (!formData.first_name.trim()) {
      newErrors.first_name = "Введите имя"
    }

    if (orderType === "delivery" && !formData.address.trim()) {
      newErrors.address = "Введите адрес"
    }

    if (!phoneNumber.trim()) {
      newErrors.phone = "Введите номер телефона"
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
  localStorage.setItem("checkout_form", JSON.stringify(formData))
}, [formData])
  return {
    formData,
    setFormData,
    errors,
    orderType,
    setOrderType,
    handleInputChange,
    validateForm,
  }
}