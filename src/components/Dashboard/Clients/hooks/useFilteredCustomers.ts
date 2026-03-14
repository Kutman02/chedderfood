import { useMemo } from "react"
import type { Customer } from "../../../../types"

export const useFilteredCustomers = (
  customersData: Customer[] | undefined,
  searchQuery: string,
  customerSortBy: "newest" | "orders" | "spent" | "name"
) => {

  return useMemo(() => {

    if (!customersData) return []

    const query = searchQuery.toLowerCase().trim()

    const filtered = customersData.filter((customer) => {

      if (!query) return true

      const fullName =
        `${customer.first_name} ${customer.last_name}`.toLowerCase()

      const phone = customer.billing?.phone?.toLowerCase() || ""
      const address = customer.billing?.address_1?.toLowerCase() || ""
      const city = customer.billing?.city?.toLowerCase() || ""
      const username = customer.username?.toLowerCase() || ""

      return (
        fullName.includes(query) ||
        phone.includes(query) ||
        address.includes(query) ||
        city.includes(query) ||
        username.includes(query)
      )

    })

    return filtered.sort((a, b) => {

      switch (customerSortBy) {

        case "newest":
          return (
            new Date(b.date_created).getTime() -
            new Date(a.date_created).getTime()
          )

        case "orders":
          return (b.orders_count || 0) - (a.orders_count || 0)

        case "spent":
          return (
            parseFloat(b.total_spent || "0") -
            parseFloat(a.total_spent || "0")
          )

        case "name":
          return (
            `${a.first_name} ${a.last_name}`.localeCompare(
              `${b.first_name} ${b.last_name}`
            )
          )

        default:
          return 0
      }

    })

  }, [customersData, searchQuery, customerSortBy])

}
