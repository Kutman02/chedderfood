import { useState } from "react"

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
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    const modal = modalRef.current
    if (!modal) return

    const touchY = e.touches[0].clientY
    const modalRect = modal.getBoundingClientRect()
    const relativeY = touchY - modalRect.top

    // свайп для закрытия только если начали с верхней части
    if (relativeY <= 50) {
      setIsDragging(true)
      setStartY(touchY)
      setCurrentY(touchY)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const y = e.touches[0].clientY
    setCurrentY(y)

    const deltaY = startY - y

    if (deltaY < 0) {
      e.preventDefault()
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    const deltaY = startY - currentY

    if (deltaY < -100) {
      onClose()
    }

    setIsDragging(false)
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`${
        isDragging ? "transition-none" : "transition-all duration-300 ease-out"
      }`}
      style={{
        transform: isDragging
          ? `translateY(${Math.max(0, currentY - startY)}px)`
          : "translateY(0)",
      }}
    >
      {children}
    </div>
  )
}