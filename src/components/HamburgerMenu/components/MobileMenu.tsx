import { MenuOverlay } from "./MenuOverlay"
import { MenuHeader } from "./MenuHeader"
import { ReceiptsButton } from "./ReceiptsButton"
import { CustomerDataCard } from "./CustomerDataCard"
import { InfoLinks } from "./InfoLinks"
import { AppInfo } from "./AppInfo"

import { InstallButton } from "../../InstallButton"

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

    <div className="fixed inset-0 z-100">

      <MenuOverlay onClick={closeMenu} />

      <div className="absolute top-0 right-0 bottom-0 bg-white w-full max-w-md flex flex-col">

        <MenuHeader onClose={closeMenu} />

        <div className="flex-1 overflow-y-auto p-4 space-y-6">

          <ReceiptsButton
            onClick={toggleReceipts}
          />

          <div>

            <h3 className="font-bold text-slate-800 mb-4">
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