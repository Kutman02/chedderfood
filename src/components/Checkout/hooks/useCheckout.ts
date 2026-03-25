import { useState, useLayoutEffect } from "react"

import { useCheckActiveOrdersCountQuery } from "@/app/services/publicApi"

import { useAppSelector } from "@/app/hooks"
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

  const savedCustomerData = useAppSelector((s) => s.receipts.customerData)

  const lockScroll = useScrollLockStore((s) => s.lock)
  const unlockScroll = useScrollLockStore((s) => s.unlock)

  const { data: activeOrdersData } = useCheckActiveOrdersCountQuery(undefined, {
    pollingInterval: 0,
  })

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

  // 👉 ВАЖНО: без useEffect
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
    if (!savedCustomerData) return

    setFormData({
      first_name: savedCustomerData.first_name,
      address: savedCustomerData.address,
      phone: savedCustomerData.phone,
      customer_note: "",
    })
  }

  /* ===============================
     SUBMIT
  =============================== */

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!validateForm(phoneNumber)) return
    if (cartItems.length === 0) return

    setShowConfirmModal(true)
  }

  /* ===============================
     CONFIRM ORDER
  =============================== */

  const handleConfirmOrder = async () => {

    setIsSubmitting(true)
    setErrorMessage("")

    try {

      if ((activeOrdersData?.length || 0) >= 3) {
        setErrorMessage("У вас уже есть 3 активных заказа")
        return
      }

      await create({
        formData: {
          ...formData,
          phone: fullPhone, // 👉 здесь формируем телефон
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