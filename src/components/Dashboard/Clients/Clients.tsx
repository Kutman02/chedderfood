import { useState } from "react"

import { useGetAllWooCustomersQuery } from "@/app/services/wooCommerceApi"

import {
  ClientsSortPanel,
  ClientsList,
  ClientsError
} from "@/components/Dashboard/Clients/components"

import { CustomerSkeleton } from "@/components/Skeleton/components"

import { useFilteredCustomers } from "@/components/Dashboard/Clients/hooks/useFilteredCustomers"

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