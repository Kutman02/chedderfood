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
    <button onClick={onClick}>

      {hasActiveOrders && (
        <span />
      )}

      <FaReceipt size={18} />

    </button>
  )
}