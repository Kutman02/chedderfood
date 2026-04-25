import { useRef, useEffect, useLayoutEffect, useState } from "react"
import type { Product } from "@/types"

import { useScrollLockStore } from "@/stores/scrollLockStore"

import { ModalHeader } from "./components/ModalHeader"
import { ProductImageGallery } from "./components/ProductImageGallery"
import { ProductInfo } from "./components/ProductInfo"
import { AddToCartButton } from "./components/AddToCartButton"
import { SwipeWrapper } from "./components/SwipeWrapper"

const PANEL_ANIMATION_MS = 260
const SWIPE_CLOSE_MS = 240

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export const ProductModalSwipe = ({
  product,
  isOpen,
  onClose,
}: ProductModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  const [renderedProduct, setRenderedProduct] = useState<Product | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const lockScroll = useScrollLockStore((s) => s.lock)
  const unlockScroll = useScrollLockStore((s) => s.unlock)

  // блокируем скролл страницы пока модалка видна
  useLayoutEffect(() => {
    if (!isRendered) return

    lockScroll()

    return () => {
      unlockScroll()
    }
  }, [isRendered, lockScroll, unlockScroll])

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

  // плавное появление и закрытие
  useEffect(() => {
    if (isOpen && product) {
      setRenderedProduct(product)
      setIsRendered(true)

      if (prefersReducedMotion) {
        setIsVisible(true)
        return
      }

      const raf = requestAnimationFrame(() => {
        setIsVisible(true)
      })

      return () => {
        cancelAnimationFrame(raf)
      }
    }

    if (!isOpen) {
      setIsVisible(false)

      if (prefersReducedMotion) {
        setIsRendered(false)
        setRenderedProduct(null)
        return
      }

      const closeTimer = setTimeout(() => {
        setIsRendered(false)
        setRenderedProduct(null)
      }, PANEL_ANIMATION_MS)

      return () => {
        clearTimeout(closeTimer)
      }
    }
  }, [isOpen, product, prefersReducedMotion])

  // закрытие по ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  if (!isRendered || !renderedProduct) return null

  const activeProduct = renderedProduct

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/20 modal-backdrop p-2 sm:p-4 transition-opacity duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleBackdropClick}
    >
      <SwipeWrapper
        modalRef={modalRef}
        onClose={onClose}
        prefersReducedMotion={prefersReducedMotion}
        closeDurationMs={SWIPE_CLOSE_MS}
      >
        <div
          ref={modalRef}
          className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[94vh] md:h-[82vh] md:max-h-190 flex flex-col transform-gpu will-change-transform transition-[transform,opacity] duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <ModalHeader onClose={onClose} />

          <div className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden overscroll-contain">
            <div className="flex flex-col md:flex-row md:h-full min-h-full">
              <ProductImageGallery product={activeProduct} />

              <div className="md:w-1/2 flex flex-col min-h-0">
                <div className="px-4 pb-4 pt-2 md:p-6 flex flex-col md:flex-1 md:min-h-0 md:overflow-y-auto overscroll-contain">
                  <ProductInfo product={activeProduct} onClose={onClose} />
                </div>

                <div className="shrink-0 px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3 border-t border-slate-100 bg-white">
                  <AddToCartButton
                    product={activeProduct}
                    onClose={onClose}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SwipeWrapper>
    </div>
  )
}