import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { MessengerSection } from "./MessengerSection";

export const ContactInfoSection = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div>
        <h2 className="text-3xl font-black text-slate-800 mb-8">
          Свяжитесь с нами
        </h2>

        <p className="text-lg text-slate-600 mb-8">
          Есть вопросы или предложения? Мы всегда рады общению с нашими
          клиентами. Выберите удобный для вас способ связи.
        </p>
      </div>

      <div className="space-y-6">
        {/* Телефон */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
              <FaPhone className="text-orange-600" size={20} />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Телефон
              </h3>

              <a
                href="tel:+996770511111"
                className="text-orange-600 hover:text-orange-700 font-medium text-lg"
              >
                +996 770 51 11 11
              </a>

              <p className="text-sm text-slate-600 mt-1">
                Звонки принимаются ежедневно
              </p>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
              <FaEnvelope className="text-orange-600" size={20} />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Email
              </h3>

              <a
                href="mailto:kutmank9@gmail.com"
                className="text-orange-600 hover:text-orange-700 font-medium break-all"
              >
                kutmank9@gmail.com
              </a>

              <p className="text-sm text-slate-600 mt-1">
                Ответим в течение 24 часов
              </p>
            </div>
          </div>
        </div>

        {/* Адрес */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
              <FaMapMarkerAlt className="text-orange-600" size={20} />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Адрес
              </h3>

              <p className="text-slate-700 font-medium">
                Курманжан датка 12
                <br />
                Ош, Кыргызстан
              </p>
            </div>
          </div>
        </div>

        {/* Время работы */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
              <FaClock className="text-orange-600" size={20} />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Время работы
              </h3>

              <div className="space-y-1 text-slate-700">
                <p className="font-medium">Понедельник - Воскресенье</p>
                <p className="text-slate-600">09:00 - 22:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MessengerSection />
    </div>
  );
};