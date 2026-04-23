import { useState, useEffect } from "react"
import type { CheckoutFormData } from "@/types"
import { STORAGE_KEYS } from "@/shared/constants/storage"
import { storage } from "@/shared/lib/storage"

const CHECKOUT_FORM_KEY = STORAGE_KEYS.CHECKOUT_FORM

const EMPTY_CHECKOUT_FORM_DATA: CheckoutFormData = {
  first_name: "",
  address: "",
  phone: "",
  customer_note: "",
  apartment_office: "",
  floor: "",
  needs_cutlery_and_napkins: false,
}

/* ===============================
   HOOK
=============================== */

export const useCheckoutForm = () => {

  const [orderType, setOrderType] =
    useState<"delivery" | "pickup">("delivery")

  const [formData, setFormData] =
    useState<CheckoutFormData>(EMPTY_CHECKOUT_FORM_DATA)

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

  const applyFormData = (patch: Partial<CheckoutFormData>) => {
    const entries = Object.entries(patch) as Array<
      [keyof CheckoutFormData, CheckoutFormData[keyof CheckoutFormData]]
    >

    if (!entries.length) return

    const normalizedPatch: Partial<CheckoutFormData> = {}
    const mutablePatch = normalizedPatch as Record<
      keyof CheckoutFormData,
      CheckoutFormData[keyof CheckoutFormData]
    >

    for (const [key, value] of entries) {
      if (value === undefined || value === null) continue

      mutablePatch[key] =
        typeof value === "string"
          ? value.slice(0, 255)
          : value
    }

    if (!Object.keys(normalizedPatch).length) return

    setFormData((prev) => ({
      ...prev,
      ...normalizedPatch,
    }))

    setErrors((prev) => {
      if (!Object.keys(prev).length) return prev

      const next = { ...prev }

      for (const [key, value] of entries) {
        if (!(key in next)) continue

        if (typeof value === "string") {
          if (value.trim()) {
            delete next[key]
          }
          continue
        }

        delete next[key]
      }

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
    storage.setJSON(CHECKOUT_FORM_KEY, {
      first_name: formData.first_name,
      address: formData.address,
      phone: formData.phone,
      customer_note: formData.customer_note,
      apartment_office: formData.apartment_office,
      floor: formData.floor,
      needs_cutlery_and_napkins: formData.needs_cutlery_and_napkins,
    })
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
    applyFormData,
    validateForm,
  }
}
