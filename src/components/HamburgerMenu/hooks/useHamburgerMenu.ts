import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"

import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { clearCustomerData } from "@/app/slices/receiptsSlice"
import { openReceipts, closeReceipts } from "@/app/slices/uiSlice"

import { useScrollLockStore } from "@/stores/scrollLockStore"

export const useHamburgerMenu = () => {

  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

  const isReceiptsOpen = useAppSelector((s) => s.ui.isReceiptsOpen)
  const customerData = useAppSelector((s) => s.receipts.customerData)

  const lockScroll = useScrollLockStore((s) => s.lock)
  const unlockScroll = useScrollLockStore((s) => s.unlock)

  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // управление scroll lock
useEffect(() => {

  if (!isOpen) return

  lockScroll()

  return () => {
    unlockScroll()
  }

}, [isOpen])

  // определение mobile
  useEffect(() => {

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()

    window.addEventListener("resize", checkMobile)

    return () =>
      window.removeEventListener("resize", checkMobile)

  }, [])

const openMenu = () => {
  console.log("OPEN MENU")
  setIsOpen(true)
}  
  const closeMenu = () => setIsOpen(false)

  const toggleReceipts = () => {

    if (isReceiptsOpen) {

      dispatch(closeReceipts())

      const params = new URLSearchParams(searchParams)
      params.delete("modal")

      setSearchParams(params)

    } else {

      dispatch(openReceipts())

      const params = new URLSearchParams(searchParams)
      params.set("modal", "mycheks")

      setSearchParams(params)

    }

    closeMenu()

  }

  const clearCustomer = () => {

    if (window.confirm("Очистить сохраненные данные клиента?")) {

      dispatch(clearCustomerData())

      closeMenu()

    }

  }

  return {
    isOpen,
    isMobile,
    openMenu,
    closeMenu,
    toggleReceipts,
    clearCustomer,
    customerData
  }

}