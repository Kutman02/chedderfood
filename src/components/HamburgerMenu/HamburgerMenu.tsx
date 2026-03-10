import type { HamburgerMenuProps } from "./types"

import { useHamburgerMenu } from "./hooks/useHamburgerMenu"

import {
  HamburgerButton,
  MobileMenu,
  DesktopMenu
} from "./components"

export const HamburgerMenu = ({
  onCustomerDataSelect,
  onCartOpen
}: HamburgerMenuProps) => {

  const menu = useHamburgerMenu()

  // Desktop
  if (!menu.isMobile) {

    return (

      <div className="flex items-center gap-2">

        <DesktopMenu
          onCartOpen={onCartOpen}
          toggleReceipts={menu.toggleReceipts}
        />

      </div>

    )

  }

  // Mobile
  return (

    <div className="relative">

      {/* Hamburger Button */}
    <div className="p-2 text-slate-600 hover:text-orange-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
  <HamburgerButton onClick={menu.openMenu} />
</div>

      {menu.isOpen && (

        <div className="fixed inset-0 z-[100] flex">

          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={menu.closeMenu}
          />

          {/* Drawer */}
          <div className="ml-auto w-full max-w-md h-full bg-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">

            {/* Menu Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">

              <MobileMenu
                closeMenu={menu.closeMenu}
                toggleReceipts={menu.toggleReceipts}
                clearCustomer={menu.clearCustomer}
                customerData={menu.customerData}
                onCustomerDataSelect={onCustomerDataSelect}
              />

            </div>

          </div>

        </div>

      )}

    </div>

  )

}