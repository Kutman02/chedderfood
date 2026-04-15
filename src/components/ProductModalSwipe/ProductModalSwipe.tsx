import { useRef, useEffect, useLayoutEffect } from "react"
import type { Product } from "@/types"

import { useScrollLockStore } from "@/stores/scrollLockStore"

import { ModalHeader } from "./components/ModalHeader"
import { ProductImageGallery } from "./components/ProductImageGallery"
import { ProductInfo } from "./components/ProductInfo"
import { AddToCartButton } from "./components/AddToCartButton"
import { SwipeWrapper } from "./components/SwipeWrapper"

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

  const lockScroll = useScrollLockStore((s) => s.lock)
  const unlockScroll = useScrollLockStore((s) => s.unlock)

  // блокируем скролл страницы при открытии модалки
  useLayoutEffect(() => {
    if (!isOpen) return

    lockScroll()

    return () => {
      unlockScroll()
    }
  }, [isOpen, lockScroll, unlockScroll])

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

  if (!isOpen || !product) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-2 sm:p-4"
      onClick={handleBackdropClick}
    >
      <SwipeWrapper modalRef={modalRef} onClose={onClose}>
        <div
          ref={modalRef}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[94vh] md:h-[82vh] md:max-h-190 flex flex-col"
        >
          <ModalHeader onClose={onClose} />

          <div className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden overscroll-contain">
            <div className="flex flex-col md:flex-row md:h-full min-h-full">
              <ProductImageGallery product={product} />

              <div className="md:w-1/2 flex flex-col min-h-0">
                <div className="px-4 pb-4 pt-2 md:p-6 flex flex-col md:flex-1 md:min-h-0 md:overflow-y-auto overscroll-contain">
                  <ProductInfo product={product} onClose={onClose} />
                </div>

                <div className="shrink-0 px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3 border-t border-slate-100 bg-white">
                <AddToCartButton
                  product={product}
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