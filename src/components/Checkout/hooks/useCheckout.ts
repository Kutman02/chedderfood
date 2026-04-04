import { useState, useLayoutEffect, useEffect } from "react"

import { useScrollLockStore } from "@/stores/scrollLockStore"

import { CIS_COUNTRIES } from "../constants/countries"

import { useCartSummary } from "./useCartSummary"
import { useCheckoutForm } from "./useCheckoutForm"
import { useCreateOrder } from "./useCreateOrder"

interface UseCheckoutProps {
  onClose: () => void
}

export const useCheckout = ({ onClose }: UseCheckoutProps) => {

  /* ===============================
     EXTERNAL HOOKS
  =============================== */

  const { cartItems, totalAmount } = useCartSummary()

  const {
    formData,
    setFormData,
    errors,
    orderType,
    setOrderType,
    handleInputChange,
    validateForm,
  } = useCheckoutForm()

  const { create } = useCreateOrder()

  const lockScroll = useScrollLockStore((s) => s.lock)
  const unlockScroll = useScrollLockStore((s) => s.unlock)

  /* ===============================
     UI STATE
  =============================== */

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  /* ===============================
     PHONE STATE
  =============================== */

  const [selectedCountry, setSelectedCountry] = useState(CIS_COUNTRIES[0])
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)

  const fullPhone = phoneNumber
    ? `${selectedCountry.code}${phoneNumber}`
    : ""

  /* ===============================
     SCROLL LOCK
  =============================== */

  useLayoutEffect(() => {
    lockScroll()
    return () => unlockScroll()
  }, [lockScroll, unlockScroll])

  /* ===============================
     INPUTS
  =============================== */

  const handlePhoneNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "")
    const limited = value.slice(0, selectedCountry.digits)
    setPhoneNumber(limited)
  }

  const handleCountrySelect = (country: typeof CIS_COUNTRIES[0]) => {
    setSelectedCountry(country)
    setIsCountryDropdownOpen(false)
  }

  const toggleCountryDropdown = () => {
    setIsCountryDropdownOpen((prev) => !prev)
  }

  /* ===============================
     AUTOFILL
  =============================== */

  const handleAutoFill = () => {
    try {
      const saved = localStorage.getItem("checkout_form")
      if (!saved) return

      const parsed = JSON.parse(saved)

      setFormData((prev) => ({
        ...prev,
        ...parsed,
      }))

      if (parsed.phone?.startsWith(selectedCountry.code)) {
        const phoneWithoutCode = parsed.phone.slice(selectedCountry.code.length)
        setPhoneNumber(phoneWithoutCode)
      }

    } catch (e) {
      console.error("autofill error", e)
    }
  }

  /* ===============================
     SUBMIT
  =============================== */

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!validateForm(phoneNumber)) return

    if (cartItems.length === 0) {
      setErrorMessage("Корзина пуста")
      return
    }

    setShowConfirmModal(true)
  }

  /* ===============================
     CONFIRM ORDER
  =============================== */

  const handleConfirmOrder = async () => {

    setIsSubmitting(true)
    setErrorMessage("")

    try {
      await create({
        formData: {
          ...formData,
          phone: fullPhone,
        },
        cartItems,
        totalAmount,
        orderType,
        onClose,
      })

    } catch (err) {
      console.error(err)
      setErrorMessage("Ошибка создания заказа")
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ===============================
     CANCEL
  =============================== */

  const handleCancelConfirm = () => {
    setShowConfirmModal(false)
    setErrorMessage("")
  }

  /* ===============================
     SYNC PHONE → FORM
  =============================== */

  useEffect(() => {
    if (!phoneNumber) return

    setFormData((prev) => ({
      ...prev,
      phone: fullPhone,
    }))
  }, [fullPhone, phoneNumber, setFormData])

  /* ===============================
     RETURN
  =============================== */

  return {
    formData,
    errors,

    orderType,
    selectedCountry,
    phoneNumber,
    isCountryDropdownOpen,

    cartItems,
    totalAmount,

    showConfirmModal,
    isSubmitting,
    errorMessage,

    handleInputChange,
    handlePhoneNumberChange,

    handleCountrySelect,
    toggleCountryDropdown,
    setOrderType,

    handleSubmit,
    handleConfirmOrder,
    handleCancelConfirm,
    handleAutoFill,
  }
}