import { baseApi } from "../base/baseApi"
import type { ProductsResponse } from "@/types"

/* =========================
   API
========================= */

export const publicProductsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =========================
       GET PUBLIC PRODUCTS (CLIENT)
    ========================= */

    getPublicProducts: builder.query<ProductsResponse, void>({
      query: () => ({
        url: "/custom/v1/products",
        method: "GET",
      }),

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