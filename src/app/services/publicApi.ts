import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Отдельный API для публичных запросов без авторизации
export const publicApi = createApi({
  reducerPath: 'publicApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.PROD 
      ? 'https://cd444351-wordpress-zdtv5.tw1.ru/wp-json/'
      : '/wp-json/',
    credentials: 'include', // Важно для cookies и сессий WordPress
    prepareHeaders: (headers) => {
      // WooCommerce Basic Auth for API authentication
      const consumerKey = 'ck_0cae419a8938564cd19a80fd72c31fc15b30c6d6';
      const consumerSecret = 'cs_82f076acfa6a7009482cfe16bd9c3f10b6e39846';
      
      if (consumerKey && consumerSecret) {
        const credentials = `${consumerKey}:${consumerSecret}`;
        const basicAuth = btoa(credentials);
        headers.set('Authorization', `Basic ${basicAuth}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['PublicOrder', 'Products', 'Categories'],
  endpoints: (builder) => ({
    // Получение публичного заказа по ID (без авторизации)
    getPublicOrder: builder.query({
      query: (orderId) => `wc/v3/orders/${orderId}`,
      providesTags: (_result, _error, id) => [{ type: 'PublicOrder', id }],
    }),
    // Публичный метод для получения товаров
    getPublicProducts: builder.query({
      query: ({ search = '', per_page = 100, orderby = 'date', order = 'desc', status = 'publish' }) => {
        const params = new URLSearchParams({
          per_page: per_page.toString(),
          orderby,
          order,
          status,
        });
        if (search) {
          params.append('search', search);
        }
        return `wc/v3/products?${params.toString()}`;
      },
      providesTags: ['Products'],
    }),
    // Публичный метод для получения категорий
    getPublicProductCategories: builder.query({
      query: ({ per_page = 100 }) => {
        const params = new URLSearchParams({
          per_page: per_page.toString(),
        });
        return `wc/v3/products/categories?${params.toString()}`;
      },
      providesTags: ['Categories'],
    }),
  }),
});

export const { 
  useGetPublicOrderQuery,
  useGetPublicProductsQuery,
  useGetPublicProductCategoriesQuery
} = publicApi;
