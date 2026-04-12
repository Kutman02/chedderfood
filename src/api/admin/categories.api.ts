import { baseApi } from "../base/baseApi"
import type { Category, CategoriesResponse } from "@/types"

/* =========================
   ADMIN CATEGORIES API
   Эндпоинт: GET /custom/v1/categories
   Требует аутентификацию (Bearer token)
========================= */

export const adminCategoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =========================
       GET CATEGORIES (ADMIN)
    ========================= */

    getCategories: builder.query<Category[], void>({
      query: () => ({
        url: "/custom/v1/categories",
        method: "GET",
      }),

      transformResponse: (response: CategoriesResponse) => response.data ?? [],

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
