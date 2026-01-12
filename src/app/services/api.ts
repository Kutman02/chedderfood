import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, Customer, Order, AnalyticsResponse } from '../../types/types';
import { format, subDays } from 'date-fns';
import { WORDPRESS_APP_PASSWORD, WORDPRESS_USERNAME, API_BASE_URL, WOOCOMMERCE_CONSUMER_KEY, WOOCOMMERCE_CONSUMER_SECRET } from './apiConfig';
// checkAppPasswordConfig автоматически вызывается при импорте apiConfig в dev режиме

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include', // ✅ MANDATORY for cross-domain cookies
    prepareHeaders: (headers, { endpoint }) => {
      if (import.meta.env.DEV) {
        console.log('=== API Request Headers Debug ===');
        console.log('Endpoint:', endpoint);
        console.log('Endpoint type:', typeof endpoint);
        console.log('Endpoint string:', String(endpoint));
      }
      
      // Определяем тип запроса по имени endpoint
      // WooCommerce API endpoints: getProducts, getOrders, getCustomers, etc.
      // WordPress REST API endpoints: uploadImage
      const endpointStr = String(endpoint || '').toLowerCase();
      const isWordPressMediaUpload = endpointStr === 'uploadimage' || endpointStr.includes('uploadimage');
      const isWooCommerceAPI = !isWordPressMediaUpload; // Все остальные - WooCommerce API
      
      if (import.meta.env.DEV) {
        console.log('Is WordPress Media Upload:', isWordPressMediaUpload);
        console.log('Is WooCommerce API:', isWooCommerceAPI);
      }
      
      if (isWooCommerceAPI) {
        // ✅ WooCommerce API: ТОЛЬКО Basic Auth, БЕЗ nonce, БЕЗ куки
        // credentials: 'omit' установлен в каждом endpoint для предотвращения конфликтов
        if (WOOCOMMERCE_CONSUMER_KEY && WOOCOMMERCE_CONSUMER_SECRET) {
          const credentials = `${WOOCOMMERCE_CONSUMER_KEY}:${WOOCOMMERCE_CONSUMER_SECRET}`;
          const basicAuth = btoa(credentials);
          headers.set('Authorization', `Basic ${basicAuth}`);
          if (import.meta.env.DEV) {
            console.log('✅ WooCommerce Basic Auth: SET');
            console.log('🚫 Nonce: NOT SET (not needed for WooCommerce API)');
            console.log('🚫 Cookies: OMITTED (using Basic Auth only)');
          }
        } else {
          if (import.meta.env.DEV) {
            console.error('❌ WooCommerce API ключи не настроены! Установите VITE_WC_CONSUMER_KEY и VITE_WC_CONSUMER_SECRET');
          }
        }
      } else {
        // ✅ WordPress REST API: Application Password ИЛИ nonce + куки
        if (import.meta.env.DEV) {
          console.log('ℹ️ WordPress REST API - choosing auth method');
        }
        
        // Удаляем WooCommerce Basic Auth, если был установлен
        headers.delete('Authorization');
        
        // Приоритет 1: Application Password (работает без куки и nonce)
        if (WORDPRESS_USERNAME && WORDPRESS_APP_PASSWORD) {
          // Убираем пробелы из Application Password (WordPress генерирует с пробелами, но для Basic Auth нужны без пробелов)
          const cleanPassword = WORDPRESS_APP_PASSWORD.replace(/\s+/g, '');
          const appCredentials = `${WORDPRESS_USERNAME}:${cleanPassword}`;
          const appAuth = btoa(appCredentials);
          headers.set('Authorization', `Basic ${appAuth}`);
          if (import.meta.env.DEV) {
            console.log('✅ WordPress Application Password: SET (for media upload)');
            console.log('✅ Username:', WORDPRESS_USERNAME);
            console.log('✅ App Password length:', cleanPassword.length, 'characters');
            console.log('✅ App Password (last 4): ***' + (cleanPassword.slice(-4) || ''));
            console.log('✅ Basic Auth header: Basic ' + appAuth.substring(0, 20) + '...');
            console.log('💡 Using Application Password ONLY - nonce and cookies NOT used');
          }
          // НЕ добавляем nonce при использовании Application Password
          // WordPress может отклонить запрос, если оба метода используются одновременно
          // Явно удаляем X-WP-Nonce header, если он был установлен ранее
          headers.delete('X-WP-Nonce');
          if (import.meta.env.DEV) {
            console.log('🚫 X-WP-Nonce header: REMOVED (not needed with Application Password)');
          }
        } else {
          if (import.meta.env.DEV) {
            console.log('⚠️ Application Password NOT configured');
            console.log('⚠️ WORDPRESS_USERNAME:', WORDPRESS_USERNAME ? 'SET' : 'NOT SET');
            console.log('⚠️ WORDPRESS_APP_PASSWORD:', WORDPRESS_APP_PASSWORD ? 'SET' : 'NOT SET');
            console.log('⚠️ No Application Password - using nonce + cookies');
            console.log('💡 Tip: Set VITE_WP_USERNAME and VITE_WP_APP_PASSWORD for better auth');
          }
          
          const nonce = localStorage.getItem('wp_nonce');
          
          if (!nonce) {
            if (import.meta.env.DEV) {
              console.warn('⚠️ No nonce in localStorage');
              console.error('❌ Media upload requires either Application Password or valid WordPress nonce!');
              console.error('❌ Please login as admin first or configure Application Password!');
            }
          } else {
            headers.set('X-WP-Nonce', nonce);
            if (import.meta.env.DEV) {
              console.log('✅ X-WP-Nonce:', nonce.substring(0, 10) + '...');
              console.log('✅ X-WP-Nonce length:', nonce.length);
              console.log('🍪 Cookies will be sent with credentials: include');
            }
          }
        }
      }
      
      // Для FormData (uploadImage) RTK Query автоматически не устанавливает Content-Type
      // Браузер установит Content-Type автоматически с правильным boundary
      // Важно: не устанавливаем Content-Type вручную для FormData
      
      if (import.meta.env.DEV) {
        console.log('🌐 BaseUrl:', API_BASE_URL);
        console.log('🍪 Credentials: include');
        console.log('=== End Debug ===');
      }
      
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
        credentials: 'omit', // ✅ WooCommerce API использует только Basic Auth, без куки
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
        credentials: 'omit', // ✅ WooCommerce API использует только Basic Auth, без куки
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
        credentials: 'omit', // ✅ WooCommerce API использует только Basic Auth, без куки
      }),
      providesTags: ['Orders'],
    }),
    // Метод для смены статуса
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `wc/v3/orders/${id}`,
        method: 'PUT',
        body: { status },
        credentials: 'omit', // ✅ WooCommerce API использует только Basic Auth, без куки
      }),
      invalidatesTags: ['Orders', 'Order'],
    }),
    // Метод для обновления заказа (комментарии, заметки)
    updateOrder: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `wc/v3/orders/${id}`,
        method: 'PUT',
        body,
        credentials: 'omit', // ✅ WooCommerce API использует только Basic Auth, без куки
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
        credentials: 'omit', // ✅ WooCommerce API использует только Basic Auth, без куки
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
        credentials: 'omit', // ✅ WooCommerce API использует только Basic Auth, без куки
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
        credentials: 'omit', // ✅ WooCommerce API использует только Basic Auth, без куки
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
        return {
          url,
          credentials: 'omit', // ✅ WooCommerce Analytics API использует только Basic Auth, без куки
        };
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
        return {
          url,
          credentials: 'omit', // ✅ WooCommerce Analytics API использует только Basic Auth, без куки
        };
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
        credentials: 'omit', // ✅ WooCommerce API использует только Basic Auth, без куки
      }),
      providesTags: ['Products'],
    }),
    // Метод для создания товара
    createProduct: builder.mutation({
      query: (productData) => ({
        url: 'wc/v3/products',
        method: 'POST',
        body: productData,
        credentials: 'omit', // ✅ WooCommerce API использует только Basic Auth, без куки
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
      transformErrorResponse: (response: { status: number; data?: unknown }, meta) => {
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