import { baseApi } from "../base/baseApi"
import { normalizeCustomersResponse } from "./customers.transformers"
import type { Customer, CustomerDetails } from "@/types"

/* =========================
   ADMIN CUSTOMERS API
   Эндпоинты:
   - GET /custom/v1/customers (получить список клиентов)
   - GET /custom/v1/customers/{phone} (получить детали клиента по телефону)
   Требует аутентификацию (Bearer token)
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

      transformResponse: normalizeCustomersResponse,

      providesTags: [
        { type: "Customers" as const, id: "LIST" },
      ],
    }),

    /* =========================
       GET CUSTOMER DETAILS BY PHONE
    ========================= */

    getCustomerDetails: builder.query<
      CustomerDetails,
      string
    >({
      query: (phone) => ({
        url: `/custom/v1/customers/${encodeURIComponent(phone)}`,
        method: "GET",
      }),

      providesTags: (_result, _error, phone) => [
        { type: "Customers" as const, id: phone },
      ],
    }),

  }),
})

/* =========================
   EXPORT HOOKS
========================= */

export const {
  useGetCustomersQuery,
  useGetCustomerDetailsQuery,
} = adminCustomersApi
