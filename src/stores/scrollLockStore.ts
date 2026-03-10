import { create } from "zustand"

interface ScrollLockState {
  isLocked: boolean
  lock: () => void
  unlock: () => void
}

export const useScrollLockStore = create<ScrollLockState>((set, get) => ({
  isLocked: false,

  lock: () => {
    if (typeof window === "undefined") return

    const { isLocked } = get()
    if (isLocked) return

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = "hidden"

    // чтобы не было layout shift из-за исчезновения scrollbar
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    set({ isLocked: true })
  },

  unlock: () => {
    if (typeof window === "undefined") return

    const { isLocked } = get()
    if (!isLocked) return

    document.body.style.overflow = ""
    document.body.style.paddingRight = ""

    set({ isLocked: false })
  },
}))