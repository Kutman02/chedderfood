import { useState } from "react"
import { useGetAllWooCustomersQuery } from "../../../app/services/wooCommerceApi"

import { ClientsSortPanel } from "./components/ClientsSortPanel"
import { ClientsList } from "./components/ClientsList"
import { ClientsError } from "./components/ClientsError"

import { CustomerSkeleton } from "../../Skeleton"

import { useFilteredCustomers } from "./hooks/useFilteredCustomers"

interface ClientsProps {
  searchQuery: string
}

export const Clients = ({ searchQuery }: ClientsProps) => {

  const [customerSortBy, setCustomerSortBy] =
    useState<"orders" | "spent">("orders")

  const {
    data: customersData,
    isLoading,
    error
  } = useGetAllWooCustomersQuery({ per_page: 100 })

  const filteredCustomers = useFilteredCustomers(
    customersData,
    searchQuery,
    customerSortBy
  )

  if (isLoading) {

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomerSkeleton count={6}/>
      </div>
    )

  }

  if (error) {
    return <ClientsError/>
  }

  return (

    <>

      <ClientsSortPanel
        sortBy={customerSortBy}
        setSortBy={setCustomerSortBy}
      />

      <ClientsList customers={filteredCustomers} />

    </>

  )

}