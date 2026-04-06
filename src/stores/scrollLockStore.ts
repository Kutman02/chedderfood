import { create } from "zustand"

interface ScrollLockStore {
  isLocked: boolean
  lock: () => void
  unlock: () => void
}

export const useScrollLockStore = create<ScrollLockStore>((set) => ({
  isLocked: false,

  lock: () => {
    document.body.style.overflow = "hidden"
    set({ isLocked: true })
  },

  unlock: () => {
    document.body.style.overflow = ""
    set({ isLocked: false })
  },
}))
