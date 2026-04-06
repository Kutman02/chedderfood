import { baseApi } from "../base/baseApi"
import type { Customer, CustomersResponse } from "@/types"

/* =========================
   PARAMS
========================= */

export interface GetCustomersParams {
  page?: number
  per_page?: number
  search?: string
}

/* =========================
   API
========================= */

export const adminCustomersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =========================
       GET CUSTOMERS (ADMIN)
    ========================= */

    getCustomers: builder.query<
      Customer[],
      GetCustomersParams | void
    >({
      query: (params) => ({
        url: "/custom/v1/customers",
        method: "GET",
        params: params || {},
      }),

      providesTags: [
        { type: "Customers" as const, id: "LIST" },
      ],
    }),

  }),
})

/* =========================
   EXPORT HOOKS
========================= */

export const {
  useGetCustomersQuery,
} = adminCustomersApi
