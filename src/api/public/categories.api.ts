import { baseApi } from "../base/baseApi"
import { normalizePublicCategoriesResponse } from "./categories.transformers"
import type { Category } from "@/types"

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

      transformResponse: normalizePublicCategoriesResponse,

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
