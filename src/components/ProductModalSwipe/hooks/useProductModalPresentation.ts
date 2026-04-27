import { useEffect, useState } from "react"
import type { RefObject } from "react"
import type { Product } from "@/types"

type UseProductModalPresentationArgs = {
  isOpen: boolean
  product: Product | null
  modalRef: RefObject<HTMLDivElement | null>
  panelAnimationMs: number
  onResetPullState: () => void
}

export const useProductModalPresentation = ({
  isOpen,
  product,
  modalRef,
  panelAnimationMs,
  onResetPullState,
}: UseProductModalPresentationArgs) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  const [renderedProduct, setRenderedProduct] = useState<Product | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return

    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => setPrefersReducedMotion(media.matches)

    updatePreference()

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", updatePreference)
      return () => media.removeEventListener("change", updatePreference)
    }

    media.addListener(updatePreference)
    return () => media.removeListener(updatePreference)
  }, [])

  useEffect(() => {
    if (isOpen && product) {
      setRenderedProduct(product)
      setIsRendered(true)
      onResetPullState()

      if (prefersReducedMotion) {
        setIsVisible(true)
        return
      }

      const raf = requestAnimationFrame(() => {
        const modal = modalRef.current
        if (modal) {
          modal.style.transition = ""
          modal.style.transform = ""
          modal.style.opacity = ""
        }
        setIsVisible(true)
      })

      return () => {
        cancelAnimationFrame(raf)
      }
    }

    if (!isOpen) {
      setIsVisible(false)
      onResetPullState()

      if (prefersReducedMotion) {
        setIsRendered(false)
        setRenderedProduct(null)
        return
      }

      const closeTimer = setTimeout(() => {
        setIsRendered(false)
        setRenderedProduct(null)
      }, panelAnimationMs)

      return () => {
        clearTimeout(closeTimer)
      }
    }
  }, [isOpen, modalRef, onResetPullState, panelAnimationMs, prefersReducedMotion, product])

  return {
    isVisible,
    isRendered,
    renderedProduct,
    prefersReducedMotion,
  }
}
