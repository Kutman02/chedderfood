import { useMemo } from "react"
import type { Customer } from "../../../../types"

export const useFilteredCustomers = (
  customersData: Customer[] | undefined,
  searchQuery: string,
  customerSortBy: "orders" | "spent"
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

      if (customerSortBy === "orders") {
        return (b.orders_count || 0) - (a.orders_count || 0)
      }

      const spentA = parseFloat(a.total_spent || "0")
      const spentB = parseFloat(b.total_spent || "0")

      return spentB - spentA

    })

  }, [customersData, searchQuery, customerSortBy])

}