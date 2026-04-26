import { useEffect } from "react"
import { ORDERS_SECTION_PRELOAD_DELAY_MS } from "../orders.constants"

export const useOrdersSectionPreload = (preload: () => void) => {
  useEffect(() => {
    const idleCallbacks = window as typeof window & {
      requestIdleCallback?: (callback: () => void) => number
      cancelIdleCallback?: (id: number) => void
    }

    if (idleCallbacks.requestIdleCallback) {
      const idleId = idleCallbacks.requestIdleCallback(() => {
        preload()
      })

      return () => idleCallbacks.cancelIdleCallback?.(idleId)
    }

    const timeoutId = window.setTimeout(() => {
      preload()
    }, ORDERS_SECTION_PRELOAD_DELAY_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [preload])
}
