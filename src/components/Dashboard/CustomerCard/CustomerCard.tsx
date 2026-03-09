import type { Customer } from "../../../types"

import { CustomerHeader } from "./components/CustomerHeader"
import { CustomerContact } from "./components/CustomerContact"
import { CustomerStats } from "./components/CustomerStats"

interface CustomerCardProps {
  customer: Customer
}

export const CustomerCard = ({ customer }: CustomerCardProps) => {

  const fullName =
    `${customer.first_name} ${customer.last_name}`.trim() ||
    customer.username

  const totalSpent =
    parseFloat(customer.total_spent || "0")

  return (

    <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-5 transition-all duration-300 hover:shadow-lg">

      <CustomerHeader fullName={fullName} />

      <CustomerContact customer={customer} />

      <CustomerStats
        orders={customer.orders_count || 0}
        spent={totalSpent}
      />

    </div>

  )

}