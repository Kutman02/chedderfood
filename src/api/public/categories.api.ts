import { baseApi } from "../base/baseApi"
import type { CategoriesResponse } from "@/types"

/* =========================
   API
========================= */

export const publicCategoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =========================
       GET PUBLIC CATEGORIES (CLIENT)
    ========================= */

    getPublicCategories: builder.query<CategoriesResponse, void>({
      query: () => ({
        url: "/custom/v1/categories",
        method: "GET",
      }),

      providesTags: [
        { type: "Categories" as const, id: "LIST" },
      ],
    }),

  }),
})

/* =========================
   EXPORT HOOKS
========================= */

export const {
  useGetPublicCategoriesQuery,
} = publicCategoriesApi
