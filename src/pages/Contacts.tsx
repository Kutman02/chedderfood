import { PublicHeader } from '../components/PublicHeader';
import { PublicFooter } from '../components/PublicFooter';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp, FaTelegram } from 'react-icons/fa';

const Contacts = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      
      <main className="flex-1">
        {/* Герой секция */}
        <section className="bg-linear-to-br from-orange-500 to-orange-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h1 className="text-5xl md:text-6xl font-black mb-6">Контакты</h1>
              <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
                Свяжитесь с нами любым удобным способом. Мы всегда рады помочь!
              </p>
            </div>
          </div>
        </section>

        {/* Основной контент */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Контактная информация */}
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div>
                <h2 className="text-3xl font-black text-slate-800 mb-8">Свяжитесь с нами</h2>
                <p className="text-lg text-slate-600 mb-8">
                  Есть вопросы или предложения? Мы всегда рады общению с нашими клиентами. 
                  Выберите удобный для вас способ связи.
                </p>
              </div>

              {/* Контакты */}
              <div className="space-y-6">
                {/* Телефон */}
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                      <FaPhone className="text-orange-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800 mb-2">Телефон</h3>
                      <a 
                        href="tel:+996770511111" 
                        className="text-orange-600 hover:text-orange-700 font-medium text-lg"
                      >
                        +996 770 51 11 11
                      </a>
                      <p className="text-sm text-slate-600 mt-1">Звонки принимаются ежедневно</p>
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
                      <h3 className="text-lg font-bold text-slate-800 mb-2">Email</h3>
                      <a 
                        href="mailto:kutmank9@gmail.com" 
                        className="text-orange-600 hover:text-orange-700 font-medium break-all"
                      >
                        kutmank9@gmail.com
                      </a>
                      <p className="text-sm text-slate-600 mt-1">Ответим в течение 24 часов</p>
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
                      <h3 className="text-lg font-bold text-slate-800 mb-2">Адрес</h3>
                      <p className="text-slate-700 font-medium">
                        Курманжан датка 12<br />
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
                      <h3 className="text-lg font-bold text-slate-800 mb-2">Время работы</h3>
                      <div className="space-y-1 text-slate-700">
                        <p className="font-medium">Понедельник - Воскресенье</p>
                        <p className="text-slate-600">09:00 - 22:00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Мессенджеры */}
              <div className="bg-linear-to-br from-orange-50 to-slate-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Мессенджеры</h3>
                <div className="flex gap-4">
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
            </div>

            {/* Карта или дополнительная информация */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 delay-100">
              <div className="bg-white rounded-2xl shadow-lg p-8 h-full">
                <h2 className="text-2xl font-black text-slate-800 mb-6">Наше местоположение</h2>
                <div className="bg-slate-100 rounded-xl h-96 flex items-center justify-center mb-6">
                  <div className="text-center">
                    <FaMapMarkerAlt className="text-orange-600 mx-auto mb-4" size={48} />
                    <p className="text-slate-600 font-medium">Курманжан датка 12</p>
                    <p className="text-slate-500 text-sm">Ош, Кыргызстан</p>
                  </div>
                  {/* Здесь можно вставить реальную карту, например через Google Maps iframe */}
                </div>
                <div className="bg-orange-50 rounded-xl p-6">
                  <h3 className="font-bold text-slate-800 mb-3">Как нас найти</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Мы находимся в центре города Ош, на улице Курманжан датка, дом 12. 
                    К нам легко добраться как на общественном транспорте, так и на личном автомобиле. 
                    Рядом есть удобная парковка.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default Contacts;

