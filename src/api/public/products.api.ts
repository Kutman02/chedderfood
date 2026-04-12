import { baseApi } from "../base/baseApi"
import type { ProductsResponse } from "@/types"

/* =========================
   PUBLIC PRODUCTS API
   Эндпоинт: GET /custom/v1/products
   Открытый доступ для клиентов
   Параметры: page, per_page, search, category
========================= */

export interface GetPublicProductsParams {
  page?: number
  per_page?: number
  search?: string
  category?: number
}

/* =========================
   API
========================= */

export const publicProductsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =========================
       GET PUBLIC PRODUCTS (CLIENT)
    ========================= */

    getPublicProducts: builder.query<ProductsResponse, GetPublicProductsParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams()
        
        if (params) {
          if (params.page !== undefined) searchParams.append("page", params.page.toString())
          if (params.per_page !== undefined) searchParams.append("per_page", params.per_page.toString())
          if (params.search) searchParams.append("search", params.search)
          if (params.category !== undefined) searchParams.append("category", params.category.toString())
        }

        const queryString = searchParams.toString()
        const url = queryString ? `/custom/v1/products?${queryString}` : "/custom/v1/products"

        return {
          url,
          method: "GET",
        }
      },

      providesTags: [
        { type: "Products" as const, id: "LIST" },
      ],
    }),

  }),
})

/* =========================
   EXPORT HOOKS
========================= */

export const {
  useGetPublicProductsQuery,
} = publicProductsApi