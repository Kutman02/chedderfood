import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// WooCommerce API with only Basic Auth (no WordPress nonce)
export const wooCommerceApi = createApi({
  reducerPath: 'wooCommerceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://cd444351-wordpress-zdtv5.tw1.ru/wp-json/',
    credentials: 'omit', // Явно отключаем cookies для Basic Auth
    prepareHeaders: (headers) => {
      console.log('=== WooCommerce API Headers Debug ===');
      
      // WooCommerce Basic Auth ONLY
      const consumerKey = 'ck_0cae419a8938564cd19a80fd72c31fc15b30c6d6';
      const consumerSecret = 'cs_82f076acfa6a7009482cfe16bd9c3f10b6e39846';
      
      if (consumerKey && consumerSecret) {
        const credentials = `${consumerKey}:${consumerSecret}`;
        const basicAuth = btoa(credentials);
        headers.set('Authorization', `Basic ${basicAuth}`);
        console.log('✅ WooCommerce Basic Auth: SET');
      console.log('🚫 WooCommerce Cookies: OMITTED (using Basic Auth only)');
      }
      
      console.log('🌐 BaseUrl: https://cd444351-wordpress-zdtv5.tw1.ru/wp-json/');
      console.log('=== End WooCommerce Debug ===');
      
      return headers;
    },
  }),
  tagTypes: ['WooOrders', 'WooProducts', 'WooCustomers'],
  endpoints: (builder) => ({
    // WooCommerce Orders - only Basic Auth
    getWooOrders: builder.query({
      query: ({ status = 'on-hold', search = '', per_page = 100, orderby = 'date', order = 'desc' }) => {
        const params = new URLSearchParams({
          per_page: per_page.toString(),
          orderby,
          order,
          ...(status !== 'all' && { status }),
          ...(search && { search })
        });
        return `wc/v3/orders?${params.toString()}`;
      },
      transformErrorResponse: (response: { status: number; data: unknown }) => {
        console.error('WooCommerce Orders API Error:', {
          status: response.status,
          data: response.data,
        });
        return response;
      },
      providesTags: ['WooOrders'],
    }),
    // WooCommerce Products - only Basic Auth
    getWooProducts: builder.query({
      query: ({ search = '', per_page = 100, orderby = 'date', order = 'desc', status = 'publish' }) => {
        const params = new URLSearchParams({
          per_page: per_page.toString(),
          orderby,
          order,
          status,
          ...(search && { search })
        });
        return `wc/v3/products?${params.toString()}`;
      },
      providesTags: ['WooProducts'],
    }),
    // WooCommerce Customers - only Basic Auth
    getWooCustomers: builder.query({
      query: ({ search = '', per_page = 100, orderby = 'registered_date', order = 'desc' }) => {
        const params = new URLSearchParams({
          per_page: per_page.toString(),
          orderby,
          order,
          ...(search && { search })
        });
        return `wc/v3/customers?${params.toString()}`;
      },
      providesTags: ['WooCustomers'],
    }),
  }),
});

export const { 
  useGetWooOrdersQuery,
  useGetWooProductsQuery,
  useGetWooCustomersQuery
} = wooCommerceApi;
