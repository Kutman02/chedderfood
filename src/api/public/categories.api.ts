import { baseApi } from "../base/baseApi"
import type { Category, CategoriesResponse } from "@/types"

/* =========================
   PUBLIC CATEGORIES API
   Эндпоинт: GET /custom/v1/categories
   Открытый доступ для клиентов
========================= */

export const publicCategoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =========================
       GET PUBLIC CATEGORIES (CLIENT)
    ========================= */

    getPublicCategories: builder.query<Category[], void>({
      query: () => ({
        url: "/custom/v1/categories",
        method: "GET",
      }),

      transformResponse: (response: CategoriesResponse) => response.data ?? [],

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
