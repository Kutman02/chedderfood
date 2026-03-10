import { FaTimes } from "react-icons/fa"
export const ReceiptsHeader = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="border-b p-6 flex justify-between">
      <h2 className="text-2xl font-bold">Мои заказы</h2>

      <button onClick={onClose}>
        <FaTimes />
      </button>
    </div>
  )
}