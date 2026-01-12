import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import { API_BASE_URL } from './apiConfig';

// API с кастомной аутентификацией WordPress
export const customAuthApi = createApi({
  reducerPath: 'customAuthApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      const nonce = localStorage.getItem('wp_nonce');
      
      console.log('Custom Auth - Token:', token ? 'Present' : 'Missing');
      console.log('Custom Auth - Nonce:', nonce ? 'Present' : 'Missing');
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      if (nonce) {
        headers.set('X-WP-Nonce', nonce);
      }
      
      return headers;
    },
    credentials: 'include', // Важно для cookies и сессий
  }),
  tagTypes: ['Orders', 'Order', 'Customers', 'Customer'],
  endpoints: (builder) => ({
    // Кастомный логин через custom/v1/login
    login: builder.mutation({
      query: ({ username, password }) => ({
        url: 'custom/v1/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { username, password },
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
