import { useMemo } from "react"
import type { Customer } from "@/types"

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

      const fullName = customer.first_name.toLowerCase()

      const phone = customer.phone?.toLowerCase() || ""
      const address = customer.address?.toLowerCase() || ""

      return (
        fullName.includes(query) ||
        phone.includes(query) ||
        address.includes(query)
      )

    })

    return filtered.sort((a, b) => {

      switch (customerSortBy) {

        case "newest":
          return 0

        case "orders":
          return (b.orders_count || 0) - (a.orders_count || 0)

        case "spent":
          return Number(b.total_spent || 0) - Number(a.total_spent || 0)

        case "name":
          return a.first_name.localeCompare(b.first_name)

        default:
          return 0
      }

    })

  }, [customersData, searchQuery, customerSortBy])

}
