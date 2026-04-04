import { baseApi } from "../base/baseApi"
import type { Product } from "@/types"
import type { CreateProductPayload } from "@/types/api.types"
import type { UpdateProductPayload } from "@/types/api.types"

export const productsApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

    // =========================
    // GET PRODUCTS
    // =========================
    getProducts: builder.query<Product[], void>({
      query: () => ({
        url: "custom/v1/products",
      }),
      providesTags: ["Products"],
    }),

    // =========================
    // CREATE PRODUCT
    // =========================
    createProduct: builder.mutation<Product, CreateProductPayload>({
  query: (body) => ({
    url: "custom/v1/products",
    method: "POST",
    body,
  }),
  invalidatesTags: ["Products"],
}),

    // =========================
    // UPDATE PRODUCT
    // =========================
   updateProduct: builder.mutation<Product, UpdateProductPayload>({
  query: ({ id, ...body }) => ({
    url: `custom/v1/products/${id}`,
    method: "PUT",
    body,
  }),
  invalidatesTags: ["Products"],
}),

    // =========================
    // DELETE PRODUCT
    // =========================
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `custom/v1/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    // =========================
    // 🔥 UPDATE ORDER (drag & drop)
    // =========================
    updateProductOrder: builder.mutation<
      any,
      { id: number; menu_order: number }
    >({
      query: ({ id, menu_order }) => ({
        url: `custom/v1/products/${id}`,
        method: "PUT",
        body: { menu_order },
      }),
      invalidatesTags: ["Products"],
    }),

    // =========================
    // 🔥 GET CATEGORIES
    // =========================
    getProductCategories: builder.query<any[], void>({
      query: () => ({
        url: "custom/v1/categories",
      }),
      providesTags: ["Products"],
    }),

  }),

  overrideExisting: false
})

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,

  // 🔥 добавили
  useUpdateProductOrderMutation,
  useGetProductCategoriesQuery,

} = productsApi