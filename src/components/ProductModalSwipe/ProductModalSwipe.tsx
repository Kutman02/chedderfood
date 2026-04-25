import { useRef, useEffect, useLayoutEffect, useState } from "react"
import type { Product } from "@/types"

import { useScrollLockStore } from "@/stores/scrollLockStore"

import { ModalHeader } from "./components/ModalHeader"
import { ProductImageGallery } from "./components/ProductImageGallery"
import { ProductInfo } from "./components/ProductInfo"
import { AddToCartButton } from "./components/AddToCartButton"
import { SwipeWrapper } from "./components/SwipeWrapper"

const PANEL_ANIMATION_MS = 320
const SWIPE_CLOSE_MS = 280
const CONTENT_PULL_CLOSE_DISTANCE = 180
const CONTENT_PULL_MAX_DISTANCE = 260

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
  const contentTouchStartYRef = useRef(0)
  const contentPullDistanceRef = useRef(0)
  const contentDraggingRef = useRef(false)
  const contentTouchPulledRef = useRef(false)
  const contentClosingRef = useRef(false)
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
      contentClosingRef.current = false
      contentDraggingRef.current = false
      contentPullDistanceRef.current = 0
      contentTouchPulledRef.current = false

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
      contentClosingRef.current = false
      contentDraggingRef.current = false
      contentPullDistanceRef.current = 0
      contentTouchPulledRef.current = false

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

  const handleContentTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    contentTouchStartYRef.current = e.touches[0].clientY
    contentTouchPulledRef.current = false
    contentPullDistanceRef.current = 0
    contentDraggingRef.current = false
  }

  const handleContentTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const deltaY = e.touches[0].clientY - contentTouchStartYRef.current
    const atTop = e.currentTarget.scrollTop <= 2

    if (!contentTouchPulledRef.current && atTop && deltaY > 8) {
      contentTouchPulledRef.current = true
      contentDraggingRef.current = true
    }

    if (contentDraggingRef.current && atTop && deltaY > 0) {
      e.preventDefault()
      e.stopPropagation()

      const modal = modalRef.current
      if (!modal) return

      const offset = Math.min(deltaY, CONTENT_PULL_MAX_DISTANCE)
      contentPullDistanceRef.current = offset

      modal.style.transition = "none"
      modal.style.transform = `translateY(${offset}px)`
      modal.style.opacity = `${Math.max(0.7, 1 - offset / 700)}`
    }
  }

  const handleContentTouchEnd = () => {
    const modal = modalRef.current
    const pulledDistance = contentPullDistanceRef.current

    if (contentDraggingRef.current && modal) {
      const shouldClose = pulledDistance >= CONTENT_PULL_CLOSE_DISTANCE

      modal.style.transition = `transform ${SWIPE_CLOSE_MS}ms cubic-bezier(0.22,1,0.36,1), opacity ${SWIPE_CLOSE_MS}ms ease-out`

      if (shouldClose) {
        modal.style.transform = "translateY(100%)"
        modal.style.opacity = "0"

        if (!contentClosingRef.current) {
          contentClosingRef.current = true
          onClose()
        }
      } else {
        modal.style.transform = "translateY(0)"
        modal.style.opacity = "1"
      }
    }

    contentTouchPulledRef.current = false
    contentDraggingRef.current = false
    contentPullDistanceRef.current = 0
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/25 p-0 sm:p-4 transition-opacity duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
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
          className={`relative bg-white rounded-t-3xl rounded-b-none sm:rounded-2xl shadow-2xl w-full max-w-5xl h-[100vh] max-h-[100vh] sm:h-auto sm:max-h-[94vh] md:h-[82vh] md:max-h-190 flex flex-col transform-gpu will-change-transform transition-[transform,opacity] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full sm:translate-y-2"
          }`}
        >
          <ModalHeader onClose={onClose} />

          <div
            className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden overscroll-contain"
            onTouchStart={handleContentTouchStart}
            onTouchMove={handleContentTouchMove}
            onTouchEnd={handleContentTouchEnd}
          >
            <div className="flex flex-col md:flex-row md:h-full min-h-full">
              <ProductImageGallery product={activeProduct} />

              <div className="md:w-1/2 flex flex-col min-h-0">
                <div className="px-4 pb-4 pt-2 md:p-6 flex flex-col md:flex-1 md:min-h-0 md:overflow-y-auto overscroll-contain">
                  <ProductInfo product={activeProduct} onClose={onClose} />
                </div>

                <div className="shrink-0 px-4 pt-2 md:px-6 md:pt-3 md:pb-6 border-t border-slate-100 bg-white sticky bottom-0 z-10 md:static safe-area-bottom">
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