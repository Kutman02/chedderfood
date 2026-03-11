import { useState } from "react"
import type { HamburgerMenuProps } from "./types"

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

  const [open, setOpen] = useState(false)

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
  clearCustomer={() => {}}
  customerData={null}
  onCustomerDataSelect={onCustomerDataSelect}
/>

          </aside>

        </div>

      </div>
    </>
  )
}