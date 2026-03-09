import { FaReceipt } from "react-icons/fa"

interface ReceiptsButtonProps {
  hasActiveOrders: boolean
  onClick: () => void
}

export const ReceiptsButton = ({
  hasActiveOrders,
  onClick,
}: ReceiptsButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="relative p-1 rounded-lg hover:bg-orange-50/80 text-orange-600"
    >
      {hasActiveOrders && (
        <span className="absolute -inset-1.5 rounded-full border-[3px] border-orange-400/30 border-t-orange-600 animate-spin-slow" />
      )}

      <FaReceipt size={18} className="relative z-10" />
    </button>
  )
}