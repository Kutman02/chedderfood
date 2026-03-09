import type { HamburgerMenuProps } from "./types"

import { useHamburgerMenu } from "./hooks/useHamburgerMenu"

import { HamburgerButton } from "./components/HamburgerButton"
import { MobileMenu } from "./components/MobileMenu"
import { DesktopMenu } from "./components/DesktopMenu"

export const HamburgerMenu = ({
  onCustomerDataSelect,
  onCartOpen
}: HamburgerMenuProps) => {

  const menu = useHamburgerMenu()

  if (!menu.isMobile) {

    return (

      <DesktopMenu
        onCartOpen={onCartOpen}
        toggleReceipts={menu.toggleReceipts}
      />

    )

  }

  return (

    <>

      <HamburgerButton
        onClick={menu.openMenu}
      />

      {menu.isOpen && (

        <MobileMenu
          closeMenu={menu.closeMenu}
          toggleReceipts={menu.toggleReceipts}
          clearCustomer={menu.clearCustomer}
          customerData={menu.customerData}
          onCustomerDataSelect={onCustomerDataSelect}
        />

      )}

    </>

  )

}