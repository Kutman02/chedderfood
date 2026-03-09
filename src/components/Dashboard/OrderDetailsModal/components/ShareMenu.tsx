import { FaWhatsapp, FaTelegram, FaCopy } from "react-icons/fa"
import type { Order } from "@/types"

interface Props {
  order: Order
}

export const ShareMenu = ({ order }: Props) => {

  const generateShareText = () => {

    return `Заказ #${order.number}
Клиент: ${order.billing.first_name}
Телефон: ${order.billing.phone}
Сумма: ${order.total} ${order.currency}`

  }

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(generateShareText())}`
    window.open(url, "_blank")
  }

  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?url=&text=${encodeURIComponent(generateShareText())}`
    window.open(url, "_blank")
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateShareText())
  }

  return (

    <div className="absolute right-0 top-12 bg-white shadow-xl border rounded-xl p-2 z-50 min-w-200px">

      <button
        onClick={handleWhatsAppShare}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 rounded-lg"
      >
        <FaWhatsapp className="text-green-600"/>
        WhatsApp
      </button>

      <button
        onClick={handleTelegramShare}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-lg"
      >
        <FaTelegram className="text-blue-500"/>
        Telegram
      </button>

      <button
        onClick={handleCopy}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-lg"
      >
        <FaCopy/>
        Копировать
      </button>

    </div>

  )

}