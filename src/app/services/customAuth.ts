import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import { API_BASE_URL, WORDPRESS_USERNAME, WORDPRESS_APP_PASSWORD } from './apiConfig';

// Функция для создания Basic Auth заголовка с Application Password
const createAppPasswordAuth = (username: string, appPassword: string): string => {
  const cleanPassword = appPassword.replace(/\s+/g, '');
  const credentials = `${username}:${cleanPassword}`;
  return `Basic ${btoa(credentials)}`;
};

// API с Application Password аутентификацией WordPress
export const customAuthApi = createApi({
  reducerPath: 'customAuthApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      
      console.log('Custom Auth - Token:', token ? 'Present' : 'Missing');
      
      // Используем Application Password для WordPress REST API запросов
      if (WORDPRESS_USERNAME && WORDPRESS_APP_PASSWORD) {
        const authHeader = createAppPasswordAuth(WORDPRESS_USERNAME, WORDPRESS_APP_PASSWORD);
        headers.set('Authorization', authHeader);
        console.log('Custom Auth - Application Password: SET');
      } else {
        console.warn('Custom Auth - Application Password: NOT CONFIGURED');
      }
      
      // Token из Redux store (если используется)
      if (token && token !== 'app_password_authenticated') {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
    credentials: 'include', // Важно для CORS
  }),
  tagTypes: ['Orders', 'Order', 'Customers', 'Customer'],
  endpoints: (builder) => ({
    // Логин через Application Password (проверка валидности через wp/v2/users/me)
    login: builder.mutation({
      query: () => ({
        url: 'wp/v2/users/me',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: unknown) => {
        console.log('Custom login response:', response);
        return response;
      },
      transformErrorResponse: (response: unknown) => {
        console.error('Custom login error:', response);
        return response;
      },
    }),
    // Получение заказов через кастомный эндпоинт
    getOrders: builder.query({
      query: ({ status = 'on-hold', search = '', per_page = 100, orderby = 'date', order = 'desc' }) => {
        const params = new URLSearchParams({
          per_page: per_page.toString(),
          orderby,
          order,
        });
        if (status !== 'all') {
          params.append('status', status);
        }
        if (search) {
          params.append('search', search);
        }
        return `wc/v3/orders?${params.toString()}`;
      },
      providesTags: ['Orders'],
    }),
    // Получение клиентов через кастомный эндпоинт
    getCustomers: builder.query({
      query: ({ search = '', per_page = 100 }) => {
        const params = new URLSearchParams({
          per_page: per_page.toString(),
        });
        if (search) {
          params.append('search', search);
        }
        return `wc/v3/customers?${params.toString()}`;
      },
      providesTags: ['Customers'],
    }),
  }),
});

// Экспортируем хуки с кастомными именами
export const useCustomLoginMutation = customAuthApi.useLoginMutation;
export const useGetCustomOrdersQuery = customAuthApi.useGetOrdersQuery;
export const useGetCustomCustomersQuery = customAuthApi.useGetCustomersQuery;
