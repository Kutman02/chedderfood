// services/apiFetch.ts

export const apiFetch = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem("token")

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  // 🔐 авто logout если токен умер
  if (res.status === 401) {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    // редирект
    window.location.href = "/login"

    throw new Error("Unauthorized")
  }

  if (!res.ok) {
    throw new Error("Request failed")
  }

  return res.json()
}