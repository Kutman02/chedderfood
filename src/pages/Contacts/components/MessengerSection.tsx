import { FaWhatsapp, FaTelegram } from "react-icons/fa";

export const MessengerSection = () => {
  return (
    <div className="bg-linear-to-br from-orange-50 to-slate-50 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-4">
        Мессенджеры
      </h3>

      <div className="flex gap-4 flex-wrap">
        <a
          href="https://wa.me/996770511111"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
        >
          <FaWhatsapp size={20} />
          <span>WhatsApp</span>
        </a>

        <a
          href="https://t.me/burgerfood"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
        >
          <FaTelegram size={20} />
          <span>Telegram</span>
        </a>
      </div>
    </div>
  );
};