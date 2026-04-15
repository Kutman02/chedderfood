import { useState, useEffect } from "react"
import type { CheckoutFormData } from "@/types"
import { STORAGE_KEYS } from "@/shared/constants/storage"

const CHECKOUT_FORM_KEY = STORAGE_KEYS.CHECKOUT_FORM

/* ===============================
   HOOK
=============================== */

export const useCheckoutForm = () => {

  const [orderType, setOrderType] =
    useState<"delivery" | "pickup">("delivery")

  const [formData, setFormData] =
    useState<CheckoutFormData>(() => {

      try {
        const saved = localStorage.getItem(CHECKOUT_FORM_KEY)

        if (saved) {
          const parsed = JSON.parse(saved)

          return {
            first_name: parsed.first_name ?? "",
            address: parsed.address ?? "",
            phone: parsed.phone ?? "",
            customer_note: parsed.customer_note ?? "",
            apartment: parsed.apartment ?? "",
            floor: parsed.floor ?? "",
            needs_cutlery: parsed.needs_cutlery ?? false,
            needs_napkins: parsed.needs_napkins ?? false,
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
        apartment: "",
        floor: "",
        needs_cutlery: false,
        needs_napkins: false,
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

    const target = e.target as HTMLInputElement | HTMLTextAreaElement
    const { name } = target
    const isCheckbox =
      "checked" in target &&
      target.type === "checkbox"

    const nextValue = isCheckbox
      ? target.checked
      : target.value.slice(0, 255)

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
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
        STORAGE_KEYS.CHECKOUT_FORM,
        JSON.stringify({
          first_name: formData.first_name,
          address: formData.address,
          phone: formData.phone,
        })
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