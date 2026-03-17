import { baseApi } from "../base/baseApi"
import type { Product } from "@/types"

type ProductStatus = "publish" | "draft" | "pending" | "private" | "all"

export const productsApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

    // =========================
    // GET PRODUCTS
    // =========================
    getProducts: builder.query<
      Product[],
      {
        search?: string
        per_page?: number
        orderby?: string
        order?: string
        status?: ProductStatus
      }
    >({

      query: ({
        search = "",
        per_page = 100,
        orderby = "date",
        order = "desc",
        status = "publish"
      }) => {

        const params = new URLSearchParams({
          per_page: per_page.toString(),
          orderby,
          order,
          ...(status !== "all" && { status }), // ✅ FIX
          ...(search && { search })
        })

        return {
          url: `wc/v3/products?${params.toString()}`,
          credentials: "omit"
        }

      },

      providesTags: ["Products"]

    }),

    // =========================
    // GET SINGLE PRODUCT
    // =========================
    getProduct: builder.query<Product, number>({

      query: (id) => ({
        url: `wc/v3/products/${id}`,
        credentials: "omit"
      }),

      providesTags: (_result, _error, id) => [
        { type: "Product", id }
      ]

    }),

    // =========================
    // CREATE PRODUCT
    // =========================
    createProduct: builder.mutation<Product, Record<string, unknown>>({

      query: (productData) => ({
        url: "wc/v3/products",
        method: "POST",
        body: productData,
        credentials: "omit"
      }),

      invalidatesTags: ["Products"]

    }),

    // =========================
    // UPDATE PRODUCT
    // =========================
    updateProduct: builder.mutation<
      Product,
      { id: number } & Record<string, unknown>
    >({

      query: ({ id, ...productData }) => ({
        url: `wc/v3/products/${id}`,
        method: "PUT",
        body: productData,
        credentials: "omit"
      }),

      invalidatesTags: ["Products", "Product"]

    }),

    // =========================
    // UPDATE ORDER (menu_order)
    // =========================
    updateProductOrder: builder.mutation<
      Product,
      { id: number; menu_order: number }
    >({

      query: ({ id, menu_order }) => ({
        url: `wc/v3/products/${id}`,
        method: "PUT",
        body: { menu_order },
        credentials: "omit"
      }),

      invalidatesTags: ["Products"]

    }),

    // =========================
    // GET CATEGORIES
    // =========================
    getProductCategories: builder.query<any[], { per_page?: number }>({

      query: ({ per_page = 100 }) => {

        const params = new URLSearchParams({
          per_page: per_page.toString()
        })

        return {
          url: `wc/v3/products/categories?${params.toString()}`,
          credentials: "omit"
        }

      },

      providesTags: ["Products"]

    })

  }),

  overrideExisting: false

})

export const {

  useGetProductsQuery,
  useGetProductQuery,

  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductOrderMutation,

  useGetProductCategoriesQuery

} = productsApi