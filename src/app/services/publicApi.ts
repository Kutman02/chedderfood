import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

/* ===============================
   TYPES
=============================== */

type ProductsQueryArgs = {
  search?: string
  per_page?: number
  orderby?: string
  order?: string
}

type CategoriesQueryArgs = {
  per_page?: number
}

/* ===============================
   API
=============================== */

export const publicApi = createApi({
  reducerPath: 'publicApi',

  baseQuery: fetchBaseQuery({
    baseUrl: '/wp-json/',
  }),

  tagTypes: ['Products', 'Categories'],

  endpoints: (builder) => ({

    /* ===============================
       PRODUCTS
    =============================== */

    getPublicProducts: builder.query<any[], ProductsQueryArgs>({
      query: (params = {}) => {
        const {
          search = '',
          per_page = 100,
          orderby = 'date',
          order = 'desc',
        } = params

        const query = new URLSearchParams({
          per_page: per_page.toString(),
          orderby,
          order,
        })

        if (search) {
          query.append('search', search)
        }

        return `wc/store/products?${query.toString()}`
      },

      providesTags: ['Products'],
    }),

    /* ===============================
       CATEGORIES
    =============================== */

    getPublicProductCategories: builder.query<any[], CategoriesQueryArgs>({
      query: (params = {}) => {
        const { per_page = 100 } = params

        const query = new URLSearchParams({
          per_page: per_page.toString(),
        })

        return `wc/store/products/categories?${query.toString()}`
      },

      providesTags: ['Categories'],
    }),

  }),
})

/* ===============================
   HOOKS
=============================== */

export const {
  useGetPublicProductsQuery,
  useGetPublicProductCategoriesQuery,
} = publicApi