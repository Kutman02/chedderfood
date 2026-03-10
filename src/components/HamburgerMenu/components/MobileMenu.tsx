import { MenuHeader, MenuOverlay, ReceiptsButton, CustomerDataCard, InfoLinks, AppInfo } from "./"
import { InstallButton } from "../components"

interface CustomerData {
  first_name: string
  phone: string
  address: string
}

interface Props {
  closeMenu: () => void
  toggleReceipts: () => void
  clearCustomer: () => void
  customerData: CustomerData | null
  onCustomerDataSelect?: (data: CustomerData) => void
}

export const MobileMenu = ({
  closeMenu,
  toggleReceipts,
  clearCustomer,
  customerData,
  onCustomerDataSelect
}: Props) => {

  return (

    <div>

      <MenuOverlay onClick={closeMenu} />

      <div>

        <MenuHeader onClose={closeMenu} />

        <div>

          <ReceiptsButton onClick={toggleReceipts} />

          <div>
            <h3>
              Мои данные
            </h3>

            <CustomerDataCard
              customerData={customerData}
              onUse={() =>
                customerData &&
                onCustomerDataSelect?.(customerData)
              }
              onClear={clearCustomer}
            />
          </div>

          <InstallButton />

          <InfoLinks onClose={closeMenu} />

          <AppInfo />

        </div>

      </div>

    </div>

  )

}