import { baseApi } from "../base/baseApi"
import {
  normalizeCategoriesResponse,
  normalizeCategoryMutationResponse,
} from "./categories.transformers"
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryDeleteResponse,
} from "@/types"

/* =========================
   ADMIN CATEGORIES API
   Эндпоинты:
   - GET /custom/v1/categories (получить категории)
   - POST /custom/v1/categories (создать категорию)
   - PUT /custom/v1/categories/{id} (обновить категорию)
   - DELETE /custom/v1/categories/{id} (удалить категорию)
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

      transformResponse: normalizeCategoriesResponse,

      providesTags: ["Categories"],
    }),

    /* =========================
       CREATE CATEGORY
    ========================= */

    createCategory: builder.mutation<Category, CreateCategoryRequest>({
      query: (data) => ({
        url: "/custom/v1/categories",
        method: "POST",
        body: data,
      }),

      transformResponse: normalizeCategoryMutationResponse,

      invalidatesTags: [
        { type: "Categories" as const, id: "LIST" },
      ],
    }),

    /* =========================
       UPDATE CATEGORY
    ========================= */

    updateCategory: builder.mutation<
      Category,
      { id: number; data: UpdateCategoryRequest }
    >({
      query: ({ id, data }) => ({
        url: `/custom/v1/categories/${id}`,
        method: "PUT",
        body: data,
      }),

      transformResponse: normalizeCategoryMutationResponse,

      invalidatesTags: (_result, _error, { id }) => [
        { type: "Categories" as const, id },
        { type: "Categories" as const, id: "LIST" },
      ],
    }),

    /* =========================
       DELETE CATEGORY
    ========================= */

    deleteCategory: builder.mutation<CategoryDeleteResponse, number>({
      query: (id) => ({
        url: `/custom/v1/categories/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, id) => [
        { type: "Categories" as const, id },
        { type: "Categories" as const, id: "LIST" },
      ],
    }),

  }),
})

/* =========================
   EXPORT HOOKS
========================= */

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = adminCategoriesApi
