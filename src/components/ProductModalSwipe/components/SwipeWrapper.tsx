import { useRef, useState } from "react"

interface SwipeWrapperProps {
  children: React.ReactNode
  modalRef: React.RefObject<HTMLDivElement | null>
  onClose: () => void
}

export const SwipeWrapper = ({
  children,
  modalRef,
  onClose,
}: SwipeWrapperProps) => {
  const [isDragging, setIsDragging] = useState(false)

  const startYRef = useRef(0)
  const currentYRef = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
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
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const modal = modalRef.current
    if (!modal) return

    const y = e.touches[0].clientY
    currentYRef.current = y

    const deltaY = y - startYRef.current

    if (deltaY > 0) {
      e.preventDefault() // блокируем скролл

      const offset = Math.max(0, deltaY)
      modal.style.transform = `translateY(${offset}px)`
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    const modal = modalRef.current
    if (!modal) return

    const deltaY = currentYRef.current - startYRef.current

    // возвращаем transition
    modal.style.transition = "transform 0.3s ease-out"

    if (deltaY > 100) {
      onClose()
    } else {
      // возврат назад
      modal.style.transform = "translateY(0)"
    }

    setIsDragging(false)
  }

  return (
    <div
      ref={modalRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="will-change-transform"
    >
      {children}
    </div>
  )
}