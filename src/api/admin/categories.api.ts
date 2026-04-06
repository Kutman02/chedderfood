import { baseApi } from "../base/baseApi"
import type { Category, CategoriesResponse } from "@/types"

/* =========================
   API
========================= */

export const adminCategoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =========================
       GET CATEGORIES (ADMIN)
    ========================= */

    getCategories: builder.query<CategoriesResponse, void>({
      query: () => ({
        url: "/custom/v1/categories",
        method: "GET",
      }),

      providesTags: ["Categories"],
    }),

  }),
})

/* =========================
   EXPORT HOOKS
========================= */

export const {
  useGetCategoriesQuery,
} = adminCategoriesApi