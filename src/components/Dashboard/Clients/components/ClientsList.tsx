import { useState } from "react"
import { FaUsers, FaChevronDown } from "react-icons/fa"
import type { Customer } from "../../../../types"

interface Props {
  customers: Customer[]
}

export const ClientsList = ({ customers }: Props) => {

  const [openId, setOpenId] = useState<string | null>(null)

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

    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

      <table className="w-full text-sm">

        <thead className="bg-slate-50 border-b">

          <tr className="text-left text-slate-600">

            <th className="px-4 py-3 font-medium">Имя</th>
            <th className="px-4 py-3 font-medium">Телефон</th>
            <th className="px-4 py-3 font-medium">Заказы</th>
            <th className="px-4 py-3"></th>

          </tr>

        </thead>

        <tbody>

          {customers.map((customer) => {

            const isOpen = openId === customer.id

            const name =
              `${customer.first_name} ${customer.last_name}`.trim() || "Без имени"

            const phone =
              customer.billing.phone || "—"

            const address =
              customer.billing.address_1 ||
              customer.shipping.address_1 ||
              "—"

            const spent =
              Number(customer.total_spent || 0)

            return (

              <>

                {/* MAIN ROW */}

                <tr
                  key={customer.id}
                  onClick={() =>
                    setOpenId(isOpen ? null : customer.id)
                  }
                  className="border-b hover:bg-slate-50 cursor-pointer"
                >

                  <td className="px-4 py-3 font-medium text-slate-800">
                    {name}
                  </td>

                  <td className="px-4 py-3 text-slate-700">
  {phone !== "—" ? (
    <a
      href={`tel:${phone}`}
      onClick={(e) => e.stopPropagation()}
      className="text-blue-600 hover:underline"
    >
      {phone}
    </a>
  ) : (
    "—"
  )}
</td>


                  <td className="px-4 py-3 text-slate-700">
                    {customer.orders_count}
                  </td>

                  <td className="px-4 py-3 text-right">

                    <FaChevronDown
                      className={`transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      size={14}
                    />

                  </td>

                </tr>

                {/* ACCORDION */}

                {isOpen && (

                  <tr className="bg-slate-50">

                    <td colSpan={4} className="px-4 py-4">

                      <div className="grid md:grid-cols-2 gap-4 text-sm">

                        <div>

                          <p className="text-slate-500">
                            Адрес
                          </p>

                          <p className="font-medium">
                            {address}
                          </p>

                        </div>

                        <div>

                          <p className="text-slate-500">
                            Потрачено
                          </p>

                          <p className="font-semibold text-green-600">
                            {spent.toLocaleString()} сом
                          </p>

                        </div>

                      </div>

                    </td>

                  </tr>

                )}

              </>

            )

          })}

        </tbody>

      </table>

    </div>

  )

}
