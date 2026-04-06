import { useState, useEffect } from "react"

/* ===============================
   TYPES
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
          const parsed = JSON.parse(saved)

          return {
            first_name: parsed.first_name ?? "",
            address: parsed.address ?? "",
            phone: parsed.phone ?? "",
            customer_note: parsed.customer_note ?? "",
          }
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

    const limitedValue = value.slice(0, 100)

    setFormData((prev) => ({
      ...prev,
      [name]: limitedValue,
    }))

    setErrors((prev) => {
      if (!prev[name as keyof CheckoutFormData]) return prev

      const next = { ...prev }
      delete next[name as keyof CheckoutFormData]
      return next
    })
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

    if (!phoneNumber || phoneNumber.length < 6) {
      newErrors.phone = "Некорректный номер"
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  /* ===============================
     SYNC ORDER TYPE
  =============================== */

  useEffect(() => {
    if (orderType === "pickup") {
      setFormData((prev) => ({
        ...prev,
        address: "",
      }))
    }
  }, [orderType])

  /* ===============================
     SAVE
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
    errors,

    orderType,
    setOrderType,

    handleInputChange,
    validateForm,
  }
}