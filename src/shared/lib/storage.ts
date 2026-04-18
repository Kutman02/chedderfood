import type { User } from "@/types"
import { LEGACY_STORAGE_KEYS, STORAGE_KEYS } from "@/shared/constants/storage"

const canUseLocalStorage = () => {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

const getRaw = (key: string): string | null => {
  if (!canUseLocalStorage()) return null

  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error(`Storage read error for ${key}:`, error)
    return null
  }
}

const setRaw = (key: string, value: string) => {
  if (!canUseLocalStorage()) return

  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.error(`Storage write error for ${key}:`, error)
  }
}

const removeRaw = (key: string) => {
  if (!canUseLocalStorage()) return

  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Storage remove error for ${key}:`, error)
  }
}

export const storage = {
  getString(key: string): string | null {
    return getRaw(key)
  },

  setString(key: string, value: string) {
    setRaw(key, value)
  },

  remove(key: string) {
    removeRaw(key)
  },

  removeMany(keys: string[]) {
    keys.forEach(removeRaw)
  },

  getJSON<T>(key: string, fallback: T): T {
    const raw = getRaw(key)
    if (!raw) return fallback

    try {
      return JSON.parse(raw) as T
    } catch (error) {
      console.error(`Storage JSON parse error for ${key}:`, error)
      return fallback
    }
  },

  setJSON(key: string, value: unknown) {
    try {
      setRaw(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Storage JSON serialize error for ${key}:`, error)
    }
  },
}

const migrateLegacyAuthKeys = () => {
  const token = getRaw(STORAGE_KEYS.AUTH_TOKEN)
  const user = getRaw(STORAGE_KEYS.AUTH_USER)

  if (!token) {
    const legacyToken = getRaw(LEGACY_STORAGE_KEYS.AUTH_TOKEN)
    if (legacyToken) {
      setRaw(STORAGE_KEYS.AUTH_TOKEN, legacyToken)
      removeRaw(LEGACY_STORAGE_KEYS.AUTH_TOKEN)
    }
  }

  if (!user) {
    const legacyUser = getRaw(LEGACY_STORAGE_KEYS.AUTH_USER)
    if (legacyUser) {
      setRaw(STORAGE_KEYS.AUTH_USER, legacyUser)
      removeRaw(LEGACY_STORAGE_KEYS.AUTH_USER)
    }
  }
}

export const authStorage = {
  getToken(): string | null {
    migrateLegacyAuthKeys()
    return getRaw(STORAGE_KEYS.AUTH_TOKEN)
  },

  getUser(): User | null {
    migrateLegacyAuthKeys()

    const raw = getRaw(STORAGE_KEYS.AUTH_USER)
    if (!raw) return null

    try {
      return JSON.parse(raw) as User
    } catch (error) {
      console.error("Storage auth user parse error:", error)
      return null
    }
  },

  setSession(token: string, user: User) {
    setRaw(STORAGE_KEYS.AUTH_TOKEN, token)

    try {
      setRaw(STORAGE_KEYS.AUTH_USER, JSON.stringify(user))
    } catch (error) {
      console.error("Storage auth user write error:", error)
    }

    removeRaw(LEGACY_STORAGE_KEYS.AUTH_TOKEN)
    removeRaw(LEGACY_STORAGE_KEYS.AUTH_USER)
  },

  clearSession() {
    removeRaw(STORAGE_KEYS.AUTH_TOKEN)
    removeRaw(STORAGE_KEYS.AUTH_USER)
    removeRaw(LEGACY_STORAGE_KEYS.AUTH_TOKEN)
    removeRaw(LEGACY_STORAGE_KEYS.AUTH_USER)
  },
}
