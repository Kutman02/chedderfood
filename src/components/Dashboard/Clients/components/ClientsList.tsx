import { FaUsers } from "react-icons/fa"
import type { Customer } from "../../../../types"

import { CustomerCard } from "../../CustomerCard/CustomerCard"

interface Props {
  customers: Customer[]
}

export const ClientsList = ({ customers }: Props) => {

  if (customers.length === 0) {

    return (

      <div className="text-center py-20">

        <FaUsers className="text-6xl text-slate-300 mx-auto mb-4"/>

        <p className="text-slate-500 text-lg">
          Клиенты не найдены
        </p>

        <p className="text-slate-400 text-sm">
          Попробуйте изменить запрос поиска
        </p>

      </div>

    )

  }

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {customers.map(customer => (

        <CustomerCard
          key={customer.id}
          customer={customer}
        />

      ))}

    </div>

  )

}