import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Order, Customer } from '../../types/types';
import { API_BASE_URL, WOOCOMMERCE_CONSUMER_KEY, WOOCOMMERCE_CONSUMER_SECRET } from './apiConfig';

// WooCommerce API with only Basic Auth (no WordPress nonce)
export const wooCommerceApi = createApi({
  reducerPath: 'wooCommerceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'omit', // Явно отключаем cookies для Basic Auth
    prepareHeaders: (headers) => {
      if (import.meta.env.DEV) {
        console.log('=== WooCommerce API Headers Debug ===');
      }
      
      // WooCommerce Basic Auth ONLY
      if (WOOCOMMERCE_CONSUMER_KEY && WOOCOMMERCE_CONSUMER_SECRET) {
        const credentials = `${WOOCOMMERCE_CONSUMER_KEY}:${WOOCOMMERCE_CONSUMER_SECRET}`;
        const basicAuth = btoa(credentials);
        headers.set('Authorization', `Basic ${basicAuth}`);
        if (import.meta.env.DEV) {
          console.log('✅ WooCommerce Basic Auth: SET');
          console.log('🚫 WooCommerce Cookies: OMITTED (using Basic Auth only)');
        }
      } else {
        if (import.meta.env.DEV) {
          console.error('❌ WooCommerce API ключи не настроены! Установите VITE_WC_CONSUMER_KEY и VITE_WC_CONSUMER_SECRET');
        }
      }
      
      if (import.meta.env.DEV) {
        console.log('🌐 BaseUrl:', API_BASE_URL);
        console.log('=== End WooCommerce Debug ===');
      }
      
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
    // Метод для получения всех клиентов (включая гостевых из заказов)
    getAllWooCustomers: builder.query({
      query: ({ per_page = 100 }) => {
        return `wc/v3/orders?per_page=${per_page}`;
      },
      transformResponse: (orders: Order[]) => {
        // Создаем уникальных клиентов из заказов
        const customersMap = new Map<string, Customer>();
        
        orders.forEach(order => {
          const billing = order.billing;
          if (billing && billing.email) {
            const customerKey = billing.email;
            
            if (!customersMap.has(customerKey)) {
              // Считаем общие заказы и потраченную сумму для этого клиента
              let totalOrders = 0;
              let totalSpent = 0;
              let firstOrderDate = order.date_created;
              let lastOrderDate = order.date_modified;
              
              orders.forEach(o => {
                if (o.billing && o.billing.email === billing.email) {
                  totalOrders++;
                  totalSpent += parseFloat(o.total || '0');
                  // Находим самую раннюю и самую позднюю дату заказов
                  if (o.date_created < firstOrderDate) {
                    firstOrderDate = o.date_created;
                  }
                  if (o.date_modified > lastOrderDate) {
                    lastOrderDate = o.date_modified;
                  }
                }
              });
              
              // Генерируем простой числовой ID из email
              let emailHash = 0;
              for (let i = 0; i < billing.email.length; i++) {
                const char = billing.email.charCodeAt(i);
                emailHash = ((emailHash << 5) - emailHash) + char;
                emailHash = emailHash & emailHash; // Конвертируем в 32-битное число
              }
              const uniqueId = Math.abs(emailHash);
              
              customersMap.set(customerKey, {
                id: uniqueId,
                first_name: billing.first_name || '',
                last_name: billing.last_name || '',
                email: billing.email,
                username: billing.email.split('@')[0],
                date_created: firstOrderDate,
                date_modified: lastOrderDate,
                billing: {
                  first_name: billing.first_name || '',
                  last_name: billing.last_name || '',
                  company: '',
                  address_1: billing.address_1 || '',
                  address_2: billing.address_2 || '',
                  city: billing.city || '',
                  postcode: '',
                  country: '',
                  email: billing.email || '',
                  phone: billing.phone || '',
                },
                shipping: order.shipping ? {
                  first_name: order.shipping.first_name || '',
                  last_name: order.shipping.last_name || '',
                  company: '',
                  address_1: order.shipping.address_1 || '',
                  address_2: order.shipping.address_2 || '',
                  city: order.shipping.city || '',
                  postcode: order.shipping.postcode || '',
                  country: '',
                } : {
                  first_name: '',
                  last_name: '',
                  company: '',
                  address_1: '',
                  address_2: '',
                  city: '',
                  postcode: '',
                  country: '',
                },
                orders_count: totalOrders,
                total_spent: totalSpent.toString(),
                role: 'customer',
              });
            }
          }
        });
        
        return Array.from(customersMap.values());
      },
      providesTags: ['WooCustomers'],
    }),
    // Метод для смены статуса заказа
    updateWooOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `wc/v3/orders/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['WooOrders'],
    }),
  }),
});

export const { 
  useGetWooOrdersQuery,
  useGetWooProductsQuery,
  useGetWooCustomersQuery,
  useGetAllWooCustomersQuery,
  useUpdateWooOrderStatusMutation
} = wooCommerceApi;
