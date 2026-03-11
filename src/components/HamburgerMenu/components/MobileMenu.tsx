import { MenuHeader, ReceiptsButton, CustomerDataCard, InfoLinks, AppInfo } from "./"
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

    <div className="flex flex-col h-full bg-white">

      {/* Header */}
      <MenuHeader onClose={closeMenu} />

      {/* Scroll Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">

        {/* Orders */}
        <ReceiptsButton onClick={toggleReceipts} />

        {/* Customer Data */}
        <section className="space-y-4">

          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
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

        </section>

        {/* Install App */}
        <InstallButton />

        {/* Info Links */}
        <section className="pt-2 border-t border-slate-200">

          <InfoLinks onClose={closeMenu} />

        </section>

        {/* App Info */}
        <section className="pt-2 border-t border-slate-200">

          <AppInfo />

        </section>

      </div>

      {/* iOS Safe Area */}
      <div className="h-[env(safe-area-inset-bottom)]" />

    </div>

  )

}