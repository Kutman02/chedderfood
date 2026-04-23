import { useState, useEffect } from "react"
import type { HamburgerMenuProps } from "./types"
import { STORAGE_KEYS } from "@/shared/constants/storage"
import { storage } from "@/shared/lib/storage"
import { useAppDispatch } from "@/app/hooks"
import { clearCart } from "@/app/slices/cartSlice"
import { clearReceipts, clearCustomerData } from "@/app/slices/receiptsSlice"

import { useScrollLockStore } from "@/stores/scrollLockStore"

import {
  HamburgerButton,
  MobileMenu,
  DesktopMenu
} from "./components"

export const HamburgerMenu = ({
  onCustomerDataSelect,
  onCartOpen,
  toggleReceipts
}: HamburgerMenuProps) => {
  const dispatch = useAppDispatch()

  const [open, setOpen] = useState(false)
  const [customerData, setCustomerData] = useState(null)

  const lock = useScrollLockStore((s) => s.lock)
  const unlock = useScrollLockStore((s) => s.unlock)

  const openMenu = () => {
    lock()
    setOpen(true)
  }

  const closeMenu = () => {
    unlock()
    setOpen(false)
  }

  // ✅ загрузка из localStorage
  useEffect(() => {
    const load = () => {
      try {
        const saved = storage.getString(STORAGE_KEYS.CHECKOUT_FORM)
        setCustomerData(saved ? JSON.parse(saved) : null)
      } catch (e) {
        console.error(e)
      }
    }

    load()

    // обновляется когда возвращаешься в вкладку
    window.addEventListener("focus", load)
    return () => window.removeEventListener("focus", load)
  }, [])

  // ✅ очистка
  const handleClearCustomer = () => {
    dispatch(clearReceipts())
    dispatch(clearCart())
    dispatch(clearCustomerData())

    storage.removeMany([
      STORAGE_KEYS.RECEIPTS,
      STORAGE_KEYS.RECEIPTS_DELETED_IDS,
      STORAGE_KEYS.ACTIVE_RECEIPT_ID,
      STORAGE_KEYS.CART,
      STORAGE_KEYS.CHECKOUT_FORM,
      STORAGE_KEYS.CUSTOMER_DATA,
      "receipts",
      "orders_receipts",
      "customer_data",
      "customerData",
    ])

    setCustomerData(null)
  }

  return (
    <>
      {/* Desktop menu */}
      <div className="hidden md:flex items-center gap-2">
        <DesktopMenu
          onCartOpen={onCartOpen}
          toggleReceipts={toggleReceipts ?? (() => {})}
        />
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">

        <HamburgerButton onClick={openMenu} />

        <div
          className={`fixed inset-0 z-1000 ${
            open ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >

          {/* Overlay */}
          <div
            onClick={closeMenu}
            className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
              open ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Drawer */}
          <aside
            className={`absolute right-0 top-0 h-full w-[320px] max-w-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
              open ? "translate-x-0" : "translate-x-full"
            }`}
          >

            <MobileMenu
              closeMenu={closeMenu}
              toggleReceipts={() => {
                toggleReceipts?.()
                closeMenu()
              }}
              clearCustomer={handleClearCustomer}   // ✅ фикс
              customerData={customerData}           // ✅ фикс
              onCustomerDataSelect={onCustomerDataSelect}
            />

          </aside>

        </div>

      </div>
    </>
  )
}