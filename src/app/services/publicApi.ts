import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL, WOOCOMMERCE_CONSUMER_KEY, WOOCOMMERCE_CONSUMER_SECRET } from './apiConfig';
import { SiteSettings } from '../../types/types';

// Отдельный API для публичных запросов без авторизации
export const publicApi = createApi({
  reducerPath: 'publicApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include', // Важно для cookies и сессий WordPress
    prepareHeaders: (headers) => {
      // WooCommerce Basic Auth for API authentication
      if (WOOCOMMERCE_CONSUMER_KEY && WOOCOMMERCE_CONSUMER_SECRET) {
        const credentials = `${WOOCOMMERCE_CONSUMER_KEY}:${WOOCOMMERCE_CONSUMER_SECRET}`;
        const basicAuth = btoa(credentials);
        headers.set('Authorization', `Basic ${basicAuth}`);
      } else if (import.meta.env.DEV) {
        console.error('❌ WooCommerce API ключи не настроены! Установите VITE_WC_CONSUMER_KEY и VITE_WC_CONSUMER_SECRET');
      }
      
      return headers;
    },
  }),
  tagTypes: ['PublicOrder', 'Products', 'Categories', 'Orders', 'SiteSettings'],
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
    // Проверка количества активных заказов с текущего IP
    checkActiveOrdersCount: builder.query({
      query: () => `wc/v3/orders?per_page=100&status=pending,on-hold,processing`,
      providesTags: ['Orders'],
    }),
    // Получение данных сайта (для футера)
    getSiteSettings: builder.query<SiteSettings, void>({
      query: () => 'wp/v2/settings',
      providesTags: ['SiteSettings'],
    }),
  }),
});

export const { 
  useGetPublicOrderQuery,
  useGetPublicProductsQuery,
  useGetPublicProductCategoriesQuery,
  useCheckActiveOrdersCountQuery,
  useGetSiteSettingsQuery,
} = publicApi;
