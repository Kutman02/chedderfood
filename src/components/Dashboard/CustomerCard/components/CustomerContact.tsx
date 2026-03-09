import { FaPhone } from "react-icons/fa"
import type { Customer } from "../../../../types"

interface Props {
  customer: Customer
}

export const CustomerContact = ({ customer }: Props) => {

  return (

    <div className="space-y-2 mb-4">

      {customer.billing.phone && (

        <div className="flex items-center gap-2 text-sm">

          <FaPhone className="text-slate-400" size={12} />

          <a
            href={`tel:${customer.billing.phone}`}
            className="text-orange-600 font-bold"
          >
            {customer.billing.phone}
          </a>

        </div>

      )}

      {customer.billing.address_1 && (

        <div className="text-sm text-slate-600">

          <p className="font-semibold">
            {customer.billing.address_1}
          </p>

          {customer.billing.city && (
            <p className="text-xs text-slate-500">
              {customer.billing.city}
            </p>
          )}

        </div>

      )}

    </div>

  )

}