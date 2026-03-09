export interface HamburgerMenuProps {
  onCustomerDataSelect?: (data: {
    first_name: string
    phone: string
    address: string
  }) => void
  onCartOpen?: () => void
}