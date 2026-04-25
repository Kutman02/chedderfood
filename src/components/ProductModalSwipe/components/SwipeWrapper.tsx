import { useRef, useState } from "react"

interface SwipeWrapperProps {
  children: React.ReactNode
  modalRef: React.RefObject<HTMLDivElement | null>
  onClose: () => void
  prefersReducedMotion?: boolean
  closeDurationMs?: number
}

export const SwipeWrapper = ({
  children,
  modalRef,
  onClose,
  prefersReducedMotion = false,
  closeDurationMs = 240,
}: SwipeWrapperProps) => {
  const [isDragging, setIsDragging] = useState(false)

  const startYRef = useRef(0)
  const currentYRef = useRef(0)
  const isClosingRef = useRef(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isClosingRef.current) return

    const modal = modalRef.current
    if (!modal) return

    const touchY = e.touches[0].clientY
    const modalRect = modal.getBoundingClientRect()
    const relativeY = touchY - modalRect.top

    // свайп только с верхней зоны
    if (relativeY <= 50) {
      setIsDragging(true)
      startYRef.current = touchY
      currentYRef.current = touchY

      // убираем transition во время драга
      modal.style.transition = "none"
      modal.style.opacity = "1"
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isClosingRef.current) return

    const modal = modalRef.current
    if (!modal) return

    const y = e.touches[0].clientY
    currentYRef.current = y

    const deltaY = y - startYRef.current

    if (deltaY > 0) {
      e.preventDefault() // блокируем скролл

      const offset = Math.max(0, deltaY)
      modal.style.transform = `translateY(${offset}px)`
      modal.style.opacity = `${Math.max(0.6, 1 - offset / 600)}`
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging || isClosingRef.current) return

    const modal = modalRef.current
    if (!modal) return

    const deltaY = currentYRef.current - startYRef.current

    if (deltaY > 100) {
      if (prefersReducedMotion) {
        onClose()
        setIsDragging(false)
        return
      }

      isClosingRef.current = true

      const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 800
      const endOffset = Math.min(viewportHeight * 0.45, 320)

      modal.style.transition = `transform ${closeDurationMs}ms cubic-bezier(0.22,1,0.36,1), opacity ${closeDurationMs}ms ease-out`
      modal.style.transform = `translateY(${endOffset}px)`
      modal.style.opacity = "0"

      onClose()

      window.setTimeout(() => {
        isClosingRef.current = false
      }, closeDurationMs)
    } else {
      // возврат назад
      modal.style.transition = `transform ${closeDurationMs}ms cubic-bezier(0.22,1,0.36,1), opacity ${closeDurationMs}ms ease-out`
      modal.style.transform = "translateY(0)"
      modal.style.opacity = "1"
    }

    setIsDragging(false)
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  )
}