import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, Customer, Order, AnalyticsResponse } from '../../types/types';
import { format, subDays } from 'date-fns';
import { WORDPRESS_APP_PASSWORD, WORDPRESS_USERNAME } from './apiConfig';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.PROD 
      ? 'https://cd444351-wordpress-zdtv5.tw1.ru/wp-json/'
      : '/wp-json/',
    credentials: 'include', // ✅ MANDATORY for cross-domain cookies
    prepareHeaders: (headers, { extra, endpoint }) => {
      console.log('=== API Request Headers Debug ===');
      console.log('Endpoint:', endpoint);
      console.log('Endpoint type:', typeof endpoint);
      console.log('Endpoint string:', String(endpoint));
      
      // Определяем, нужна ли WooCommerce Basic Auth
      // endpoint может быть строкой 'uploadImage' или объектом
      // Для WordPress REST API (wp/v2/*) НЕ используем Basic Auth
      const endpointStr = String(endpoint || '');
      const isWordPressMediaUpload = endpointStr === 'uploadImage' || endpointStr.includes('uploadImage');
      
      console.log('Is WordPress Media Upload:', isWordPressMediaUpload);
      
      // ✅ WooCommerce Basic Auth - только для WooCommerce API (wc/v3/*)
      // НЕ используем для WordPress REST API (wp/v2/*), так как это конфликтует с Cookie auth
      if (!isWordPressMediaUpload) {
        const consumerKey = 'ck_0cae419a8938564cd19a80fd72c31fc15b30c6d6';
        const consumerSecret = 'cs_82f076acfa6a7009482cfe16bd9c3f10b6e39846';
        
        if (consumerKey && consumerSecret) {
          const credentials = `${consumerKey}:${consumerSecret}`;
          const basicAuth = btoa(credentials);
          headers.set('Authorization', `Basic ${basicAuth}`);
          console.log('✅ WooCommerce Basic Auth: SET');
        }
      } else {
        console.log('ℹ️ WordPress REST API Media Upload - using Cookie auth ONLY (no Basic Auth)');
        // Явно удаляем Authorization header, если он был установлен ранее
        headers.delete('Authorization');
        
        // Если есть Application Password, используем его для медиа загрузки
        // Это работает даже без cookie сессии
        if (WORDPRESS_USERNAME && WORDPRESS_APP_PASSWORD) {
          const appCredentials = `${WORDPRESS_USERNAME}:${WORDPRESS_APP_PASSWORD}`;
          const appAuth = btoa(appCredentials);
          headers.set('Authorization', `Basic ${appAuth}`);
          console.log('✅ WordPress Application Password: SET (for media upload)');
        } else {
          console.log('⚠️ No Application Password configured - using nonce only');
          console.log('💡 Tip: Set VITE_WP_USERNAME and VITE_WP_APP_PASSWORD for better auth');
        }
      }
      
      // ✅ X-WP-Nonce from localStorage for WordPress authentication
      // КРИТИЧНО для загрузки медиа через WordPress REST API
      const nonce = localStorage.getItem('wp_nonce');
      if (nonce) {
        headers.set('X-WP-Nonce', nonce);
        console.log('✅ X-WP-Nonce:', nonce.substring(0, 10) + '...');
        console.log('✅ X-WP-Nonce length:', nonce.length);
      } else {
        console.error('❌ No nonce in localStorage - user may not be logged in');
        console.error('❌ Media upload requires valid WordPress nonce!');
        console.error('❌ Please login as admin first!');
      }
      
      // Для FormData (uploadImage) RTK Query автоматически не устанавливает Content-Type
      // Браузер установит Content-Type автоматически с правильным boundary
      // Важно: не устанавливаем Content-Type вручную для FormData
      
      console.log('🌐 BaseUrl:', import.meta.env.PROD 
        ? 'https://cd444351-wordpress-zdtv5.tw1.ru/wp-json/'
        : '/wp-json/ (proxied)');
      console.log('🍪 Credentials: include');
      console.log('=== End Debug ===');
      
      return headers;
    },
  }),
  tagTypes: ['Orders', 'Order', 'Products', 'Product', 'Customers', 'Customer'],
  endpoints: (builder) => ({
    // Метод для получения заказов с фильтрами
    getOrders: builder.query({
      query: ({ status = 'on-hold', search = '', per_page = 100, orderby = 'date', order = 'desc' }) => ({
        url: `wc/v3/orders?${new URLSearchParams({
          per_page: per_page.toString(),
          orderby,
          order,
          ...(status !== 'all' && { status }),
          ...(search && { search })
        }).toString()}`,
        credentials: 'include',
      }),
      transformErrorResponse: (response: { status: number; data: unknown }) => {
        console.error('Orders API Error:', {
          status: response.status,
          data: response.data,
          url: `wc/v3/orders?${new URLSearchParams({
            per_page: '100',
            orderby: 'date',
            order: 'desc',
            status: 'on-hold'
          }).toString()}`
        });
        return response;
      },
      providesTags: ['Orders'],
    }),
    // Метод для получения одного заказа с полной информацией
    getOrder: builder.query({
      query: (id) => ({
        url: `wc/v3/orders/${id}`,
        credentials: 'include',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),
    // Метод для получения статистики заказов
    getOrdersStats: builder.query({
      query: ({ after, before }) => ({
        url: `wc/v3/orders?${new URLSearchParams({
          per_page: '100',
          ...(after && { after }),
          ...(before && { before })
        }).toString()}`,
        credentials: 'include',
      }),
      providesTags: ['Orders'],
    }),
    // Метод для смены статуса
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `wc/v3/orders/${id}`,
        method: 'PUT',
        body: { status },
        credentials: 'include',
      }),
      invalidatesTags: ['Orders', 'Order'],
    }),
    // Метод для обновления заказа (комментарии, заметки)
    updateOrder: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `wc/v3/orders/${id}`,
        method: 'PUT',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['Orders', 'Order'],
    }),
    // Метод для получения товаров
    getProducts: builder.query({
      query: ({ search = '', per_page = 100, orderby = 'date', order = 'desc', status = 'publish' }) => ({
        url: `wc/v3/products?${new URLSearchParams({
          per_page: per_page.toString(),
          orderby,
          order,
          status,
          ...(search && { search })
        }).toString()}`,
        credentials: 'include',
      }),
      transformResponse: (response: Product[]) => {
        // Добавляем логирование для проверки полей
        console.log('API Response - товары:', response.map(p => ({
          id: p.id,
          name: p.name,
          weight: p.weight,
          hasWeight: !!p.weight
        })));
        return response;
      },
      providesTags: ['Products'],
    }),
    // Метод для получения одного товара
    getProduct: builder.query({
      query: (id) => ({
        url: `wc/v3/products/${id}`,
        credentials: 'include',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
    // Метод для получения клиентов
    getCustomers: builder.query({
      query: ({ search = '', per_page = 100, orderby = 'registered_date', order = 'desc' }) => ({
        url: `wc/v3/customers?${new URLSearchParams({
          per_page: per_page.toString(),
          orderby,
          order,
          ...(search && { search })
        }).toString()}`,
        credentials: 'include',
      }),
      transformResponse: (response: Customer[]) => {
        console.log('Customers API Response:', response);
        console.log('Customers count:', response.length);
        return response;
      },
      providesTags: ['Customers'],
    }),
    // Метод для получения всех клиентов (включая гостевых из заказов)
    getAllCustomers: builder.query({
      query: ({ per_page = 100 }) => {
        const url = `wc/v3/orders?per_page=${per_page}`;
        console.log('All Customers API URL:', url);
        return url;
      },
      transformResponse: (orders: Order[]) => {
        console.log('Orders for customers:', orders.length);
        
        // Создаем уникальных клиентов из заказов
        const customersMap = new Map();
        
        orders.forEach(order => {
          const billing = order.billing;
          if (billing && billing.email) {
            const customerKey = billing.email;
            
            if (!customersMap.has(customerKey)) {
              // Считаем общие заказы и потраченную сумму для этого клиента
              let totalOrders = 0;
              let totalSpent = 0;
              
              orders.forEach(o => {
                if (o.billing && o.billing.email === billing.email) {
                  totalOrders++;
                  totalSpent += parseFloat(o.total || '0');
                }
              });
              
              customersMap.set(customerKey, {
                id: order.id, // Используем ID заказа как временный ID
                first_name: billing.first_name || '',
                last_name: billing.last_name || '',
                email: billing.email,
                username: billing.email.split('@')[0],
                date_created: order.date_created,
                date_modified: order.date_modified,
                billing: billing,
                shipping: order.shipping || {},
                orders_count: totalOrders,
                total_spent: totalSpent.toString(),
                role: 'customer',
              });
            }
          }
        });
        
        const customers = Array.from(customersMap.values());
        console.log('Processed customers from orders:', customers.length);
        return customers;
      },
      providesTags: ['Customers'],
    }),
    // Метод для получения одного клиента
    getCustomer: builder.query({
      query: (id) => `wc/v3/customers/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Customer', id }],
    }),
    // Метод для получения статистики
    getStats: builder.query({
      query: () => ({
        url: 'wc/v3/reports/sales',
        method: 'GET',
      }),
      providesTags: ['Orders'],
    }),
    // Метод для получения аналитики
    getAnalytics: builder.query({
      query: ({ days = 30 }) => {
        const after = format(subDays(new Date(), days), 'yyyy-MM-dd');
        const before = format(new Date(), 'yyyy-MM-dd');
        const url = `wc/v3/reports/sales?after=${after}&before=${before}&per_page=100`;
        console.log('Analytics API URL:', url);
        return url;
      },
      transformResponse: (response: AnalyticsResponse) => {
        console.log('Analytics API Response:', response);
        return response;
      },
      providesTags: ['Orders'],
    }),
    // Метод для получения заказов из аналитики
    getAnalyticsOrders: builder.query({
      query: ({ after, before, per_page = 100 }) => {
        const params = new URLSearchParams({
          per_page: per_page.toString(),
        });
        if (after) params.append('after', after + 'T00:00:00');
        if (before) params.append('before', before + 'T23:59:59');
        const url = `wc-analytics/orders?${params.toString()}`;
        console.log('Analytics Orders URL:', url);
        return url;
      },
      transformResponse: (orders: Order[]) => {
        console.log('Analytics Orders Response:', orders.length, 'orders');
        console.log('Orders statuses:', orders.map(o => ({ id: o.id, status: o.status, total: o.total })));
        return orders;
      },
      providesTags: ['Orders'],
    }),
    // Метод для получения товаров из аналитики
    getAnalyticsProducts: builder.query({
      query: ({ per_page = 100 }) => {
        const url = `wc-analytics/products?per_page=${per_page}`;
        console.log('Analytics Products URL:', url);
        return url;
      },
      transformResponse: (products: Product[]) => {
        console.log('Analytics Products Response:', products.length);
        return products;
      },
      providesTags: ['Products'],
    }),
    // Метод для получения категорий товаров
    getProductCategories: builder.query({
      query: ({ per_page = 100 }) => ({
        url: `wc/v3/products/categories?${new URLSearchParams({
          per_page: per_page.toString(),
        }).toString()}`,
        credentials: 'include',
      }),
      providesTags: ['Products'],
    }),
    // Метод для создания товара
    createProduct: builder.mutation({
      query: (productData) => ({
        url: 'wc/v3/products',
        method: 'POST',
        body: productData,
        credentials: 'include',
      }),
      invalidatesTags: ['Products'],
    }),
    // Метод для обновления товара
    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `wc/v3/products/${id}`,
        method: 'PUT',
        body: productData,
      }),
      invalidatesTags: ['Products', 'Product'],
    }),
    // Метод для изменения порядка товаров (через menu_order)
    updateProductOrder: builder.mutation({
      query: ({ id, menu_order }) => ({
        url: `wc/v3/products/${id}`,
        method: 'PUT',
        body: { menu_order },
      }),
      invalidatesTags: ['Products'],
    }),
    // Метод для создания заказа
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: 'wc/v3/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Orders'],
    }),
    // Метод для загрузки изображения
    uploadImage: builder.mutation({
      query: (formData) => {
        // Для FormData нужно, чтобы браузер установил Content-Type автоматически с boundary
        // RTK Query автоматически не устанавливает Content-Type для FormData
        console.log('Upload Image - FormData:', formData);
        console.log('Upload Image - URL:', 'wp/v2/media');
        
        // Проверяем наличие nonce перед загрузкой
        const nonce = localStorage.getItem('wp_nonce');
        if (!nonce) {
          console.error('❌ CRITICAL: No nonce found! Media upload will fail.');
          console.error('Please make sure you are logged in as admin.');
        }
        
        return {
          url: 'wp/v2/media',
          method: 'POST',
          body: formData,
          credentials: 'include',
          // FormData автоматически установит правильный Content-Type с boundary
          // fetchBaseQuery не должен устанавливать Content-Type для FormData
        };
      },
      transformResponse: (response: { id?: number; source_url?: string; [key: string]: unknown }) => {
        console.log('Image Upload Success Response:', response);
        // Убеждаемся, что ответ содержит ID
        if (!response.id) {
          console.error('Response does not contain id:', response);
        }
        return response;
      },
      transformErrorResponse: (response: { status: number; data?: unknown }, meta, arg) => {
        console.error('=== Image Upload Error Details ===');
        console.error('Status:', response.status);
        console.error('Response data:', response.data);
        console.error('Full response:', response);
        
        // Выводим полную информацию об ошибке
        if (response.data && typeof response.data === 'object') {
          console.error('Error details JSON:', JSON.stringify(response.data, null, 2));
          const errorData = response.data as Record<string, unknown>;
          if ('message' in errorData) {
            console.error('Error message:', errorData.message);
          }
          if ('code' in errorData) {
            console.error('Error code:', errorData.code);
          }
          if ('data' in errorData && typeof errorData.data === 'object') {
            console.error('Error data object:', errorData.data);
          }
        }
        
        // Проверяем, есть ли информация о запросе
        if (meta && 'request' in meta) {
          console.error('Request URL:', (meta.request as { url?: string })?.url);
          console.error('Request method:', (meta.request as { method?: string })?.method);
        }
        
        console.error('=== End Error Details ===');
        
        return response;
      },
    }),
  }),
});

export const { 
  useGetOrdersQuery, 
  useGetOrderQuery,
  useGetOrdersStatsQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderMutation,
  useGetProductsQuery,
  useGetProductQuery,
  useGetCustomersQuery,
  useGetAllCustomersQuery,
  useGetCustomerQuery,
  useGetStatsQuery,
  useGetAnalyticsQuery,
  useGetAnalyticsOrdersQuery,
  useGetAnalyticsProductsQuery,
  useGetProductCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductOrderMutation,
  useCreateOrderMutation,
  useUploadImageMutation,
} = api;