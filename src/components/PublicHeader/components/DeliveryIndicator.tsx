import { Truck } from "lucide-react"

interface Props {
  isActive: boolean
  onClick: () => void
}

export const DeliveryIndicator = ({ isActive, onClick }: Props) => {
  if (!isActive) return null

  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center cursor-pointer"
      title="Посмотреть заказ"
    >
      {/* Пульсирующий фон */}
      <span className="absolute inline-flex h-8 w-8 rounded-full bg-orange-400 opacity-75 animate-ping"></span>

      {/* Иконка */}
      <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 text-white shadow-md">
        <Truck size={16} />
      </div>
    </button>
  )
}