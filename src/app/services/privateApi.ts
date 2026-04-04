import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const privateApi = createApi({
  reducerPath: 'privateApi',

  baseQuery: fetchBaseQuery({
    baseUrl: '/wp-json/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),

  endpoints: (builder) => ({
    
    getMe: builder.query({
      query: () => 'custom/v1/me',
    }),

    getOrders: builder.query({
      query: () => 'custom/v1/orders',
    }),

  }),
})

export const {
  useGetMeQuery,
  useGetOrdersQuery,
} = privateApi