import { useState, useEffect } from "react"

/* ===============================
   TYPES (локально, правильно)
=============================== */

export interface CheckoutFormData {
  first_name: string
  address: string
  phone: string
  customer_note: string
}

/* ===============================
   HOOK
=============================== */

export const useCheckoutForm = () => {

  const [orderType, setOrderType] =
    useState<"delivery" | "pickup">("delivery")

  const [formData, setFormData] =
    useState<CheckoutFormData>(() => {
      try {
        const saved = localStorage.getItem("checkout_form")

        if (saved) {
          return JSON.parse(saved) as CheckoutFormData
        }

      } catch (e) {
        console.error("Ошибка чтения localStorage", e)
      }

      return {
        first_name: "",
        address: "",
        phone: "",
        customer_note: "",
      }
    })

  const [errors, setErrors] =
    useState<Partial<CheckoutFormData>>({})

  /* ===============================
     INPUT HANDLER
  =============================== */

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {

    const { name, value } = e.target

    setFormData((prev: CheckoutFormData) => ({
      ...prev,
      [name]: value,
    }))

    if (name in errors) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  /* ===============================
     VALIDATION
  =============================== */

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

  /* ===============================
     SAVE TO LOCALSTORAGE
  =============================== */

  useEffect(() => {
    try {
      localStorage.setItem(
        "checkout_form",
        JSON.stringify(formData)
      )
    } catch (e) {
      console.error("Ошибка сохранения localStorage", e)
    }
  }, [formData])

  /* ===============================
     RETURN
  =============================== */

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