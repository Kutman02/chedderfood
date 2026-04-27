import { useEffect } from "react"

export const useOrdersSectionPreload = (preload: () => void) => {
  useEffect(() => {
    preload()
  }, [preload])
}
