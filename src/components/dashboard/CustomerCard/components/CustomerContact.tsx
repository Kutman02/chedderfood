import { FaPhone } from "react-icons/fa"
import type { Customer } from "@/types"

interface Props {
  customer: Customer
}

export const CustomerContact = ({ customer }: Props) => {

  return (

    <div className="space-y-2 mb-4">

      {customer.phone && (

        <div className="flex items-center gap-2 text-sm">

          <FaPhone className="text-slate-400" size={12} />

          <a
            href={`tel:${customer.phone}`}
            className="text-orange-600 font-bold"
          >
            {customer.phone}
          </a>

        </div>

      )}

      {customer.address && (

        <div className="text-sm text-slate-600">

          <p className="font-semibold">
            {customer.address}
          </p>

        </div>

      )}

    </div>

  )

}
