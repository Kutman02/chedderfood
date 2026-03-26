import { useState, useMemo } from "react"

import { useGetAllCustomersQuery } from "@/api"

import {
  ClientsSortPanel,
  ClientsList,
  ClientsError
} from "@/components/dashboard/Clients/components"

import { CustomerSkeleton } from "@/components/Skeleton/components"

import { useFilteredCustomers } from "@/components/dashboard/Clients/hooks/useFilteredCustomers"

interface ClientsProps {
  searchQuery: string
}

export const Clients = ({ searchQuery }: ClientsProps) => {

  const [customerSortBy, setCustomerSortBy] =
    useState<"newest" | "orders" | "spent" | "name">("newest")

  const [page, setPage] = useState(1)

  const perPage = 10

  const {
    data: customersData,
    isLoading,
    error
  } = useGetAllCustomersQuery({ per_page: 100 }) // ✅ фикс

  const customers = customersData || [] // ✅ безопасно

  const filteredCustomers = useFilteredCustomers(
    customers,
    searchQuery,
    customerSortBy
  )

  const totalPages = Math.ceil((filteredCustomers?.length || 0) / perPage)

  const paginatedCustomers = useMemo(() => {

    const start = (page - 1) * perPage
    const end = start + perPage

    return filteredCustomers?.slice(start, end)

  }, [filteredCustomers, page])

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

      <ClientsList customers={paginatedCustomers} />

      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">

        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-3 py-1 border rounded-md disabled:opacity-40"
        >
          ← Назад
        </button>

        {Array.from({ length: totalPages }).map((_, i) => {

          const pageNumber = i + 1

          return (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`px-3 py-1 rounded-md border text-sm
              ${page === pageNumber
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white hover:bg-gray-100 border-gray-300"}`}
            >
              {pageNumber}
            </button>
          )

        })}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          className="px-3 py-1 border rounded-md disabled:opacity-40"
        >
          Вперёд →
        </button>

      </div>

    </>
  )
}