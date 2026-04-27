import { useCallback, useRef } from "react"
import type { RefObject, TouchEvent } from "react"

type UseProductModalContentPullToCloseArgs = {
  modalRef: RefObject<HTMLDivElement | null>
  onClose: () => void
  closeDurationMs: number
  closeDistance: number
  maxDistance: number
}

export const useProductModalContentPullToClose = ({
  modalRef,
  onClose,
  closeDurationMs,
  closeDistance,
  maxDistance,
}: UseProductModalContentPullToCloseArgs) => {
  const contentTouchStartYRef = useRef(0)
  const contentPullDistanceRef = useRef(0)
  const contentDraggingRef = useRef(false)
  const contentTouchPulledRef = useRef(false)
  const contentClosingRef = useRef(false)

  const resetContentPullState = useCallback(() => {
    contentTouchPulledRef.current = false
    contentDraggingRef.current = false
    contentPullDistanceRef.current = 0
    contentClosingRef.current = false
  }, [])

  const handleContentTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    contentTouchStartYRef.current = event.touches[0].clientY
    contentTouchPulledRef.current = false
    contentPullDistanceRef.current = 0
    contentDraggingRef.current = false
  }, [])

  const handleContentTouchMove = useCallback((event: TouchEvent<HTMLDivElement>) => {
    const deltaY = event.touches[0].clientY - contentTouchStartYRef.current
    const atTop = event.currentTarget.scrollTop <= 2

    if (!contentTouchPulledRef.current && atTop && deltaY > 8) {
      contentTouchPulledRef.current = true
      contentDraggingRef.current = true
    }

    if (contentDraggingRef.current && atTop && deltaY > 0) {
      if (event.cancelable) {
        event.preventDefault()
      }
      event.stopPropagation()

      const modal = modalRef.current
      if (!modal) return

      const offset = Math.min(deltaY, maxDistance)
      contentPullDistanceRef.current = offset

      modal.style.transition = "none"
      modal.style.transform = `translateY(${offset}px)`
      modal.style.opacity = `${Math.max(0.7, 1 - offset / 700)}`
    }
  }, [maxDistance, modalRef])

  const handleContentTouchEnd = useCallback(() => {
    const modal = modalRef.current
    const pulledDistance = contentPullDistanceRef.current

    if (contentDraggingRef.current && modal) {
      const shouldClose = pulledDistance >= closeDistance

      modal.style.transition = `transform ${closeDurationMs}ms cubic-bezier(0.22,1,0.36,1), opacity ${closeDurationMs}ms ease-out`

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
  }, [closeDistance, closeDurationMs, modalRef, onClose])

  return {
    handleContentTouchStart,
    handleContentTouchMove,
    handleContentTouchEnd,
    resetContentPullState,
  }
}
