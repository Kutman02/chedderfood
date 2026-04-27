import { useLayoutEffect, useRef } from "react"
import type { Product } from "@/types"

import { useScrollLockStore } from "@/stores/scrollLockStore"
import { useProductModalContentPullToClose } from "./hooks/useProductModalContentPullToClose"
import { useProductModalEscapeClose } from "./hooks/useProductModalEscapeClose"
import { useProductModalPresentation } from "./hooks/useProductModalPresentation"

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

  const {
    handleContentTouchStart,
    handleContentTouchMove,
    handleContentTouchEnd,
    resetContentPullState,
  } = useProductModalContentPullToClose({
    modalRef,
    onClose,
    closeDurationMs: SWIPE_CLOSE_MS,
    closeDistance: CONTENT_PULL_CLOSE_DISTANCE,
    maxDistance: CONTENT_PULL_MAX_DISTANCE,
  })

  const {
    isVisible,
    isRendered,
    renderedProduct,
    prefersReducedMotion,
  } = useProductModalPresentation({
    isOpen,
    product,
    modalRef,
    panelAnimationMs: PANEL_ANIMATION_MS,
    onResetPullState: resetContentPullState,
  })

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

  useProductModalEscapeClose(onClose)

  if (!isRendered || !renderedProduct) return null

  const activeProduct = renderedProduct

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/25 p-0 sm:p-4 transition-opacity duration-280 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
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
          className={`relative bg-white rounded-none sm:rounded-2xl shadow-2xl w-full max-w-5xl h-screen max-h-screen sm:h-auto sm:max-h-[94vh] md:h-[82vh] md:max-h-190 flex flex-col transform-gpu will-change-transform transition-[transform,opacity] duration-320 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
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