import { baseApi } from "../base/baseApi"
import { normalizeProduct } from "@/entities/product/model/normalizeProduct"
import type { Product } from "@/entities/product/model/types"

export const productsApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

    // =========================
    // GET PRODUCTS
    // =========================
    getProducts: builder.query<Product[], void>({
      query: () => ({
        url: "custom/v1/products",
      }),

      transformResponse: (res: any[]) =>
        res.map(normalizeProduct),

      providesTags: ["Products"],
    }),

    // =========================
    // CREATE PRODUCT
    // =========================
    createProduct: builder.mutation<Product, any>({
      query: (body) => ({
        url: "custom/v1/products",
        method: "POST",
        body,
      }),

      transformResponse: (res: any) =>
        normalizeProduct(res),

      invalidatesTags: ["Products"],
    }),

    // =========================
    // UPDATE PRODUCT
    // =========================
    updateProduct: builder.mutation<
      Product,
      { id: number } & Record<string, any>
    >({
      query: ({ id, ...body }) => ({
        url: `custom/v1/products/${id}`,
        method: "PUT",
        body,
      }),

      transformResponse: (res: any) =>
        normalizeProduct(res),

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
    // GET CATEGORIES
    // =========================
    getProductCategories: builder.query<
      { id: number; name: string }[],
      void
    >({
      query: () => ({
        url: "custom/v1/categories",
      }),

      providesTags: ["Products"],
    }),

    // =========================
    // UPDATE ORDER (drag & drop)
    // =========================
    updateProductOrder: builder.mutation<
      Product,
      { id: number; menu_order: number }
    >({
      query: ({ id, menu_order }) => ({
        url: `custom/v1/products/${id}`,
        method: "PUT",
        body: { menu_order },
      }),

      invalidatesTags: ["Products"],
    }),

  }),

  overrideExisting: false,
})

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductCategoriesQuery,
  useUpdateProductOrderMutation,
} = productsApi