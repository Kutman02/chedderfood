import { apiFetch } from '@/app/services/apiFetch';

const API_URL = `${import.meta.env.VITE_SITE_URL}/wp-json/custom/v1`

export const authService = {
  async login(data: { username: string; password: string }) {
    return apiFetch(`${API_URL}/login`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async me() {
    return apiFetch(`${API_URL}/me`)
  },

  async getOrders(page = 1) {
    return apiFetch(`${API_URL}/orders?page=${page}`)
  },
}