import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaHome, FaInfoCircle, FaAddressBook, FaHeart } from 'react-icons/fa';
import { useGetSiteSettingsQuery } from '../app/services/publicApi';

export const PublicFooter = () => {
  const { data: siteSettings } = useGetSiteSettingsQuery();

  // Данные по умолчанию (fallback)
  const defaultSettings = {
    title: 'BurgerFood',
    description: 'Лучшая еда с доставкой на дом. Свежие ингредиенты, быстрая доставка, отличный сервис. Мы заботимся о каждом клиенте и гарантируем качество.',
    phone: '+996 770 51 11 11',
    email: 'kutmank9@gmail.com',
    address: 'Ош, Кыргызстан',
    city: 'Кыргызстан',
  };

  // Используем данные с сервера или значения по умолчанию
  const settings = {
    title: siteSettings?.title || defaultSettings.title,
    description: siteSettings?.description || defaultSettings.description,
    phone: siteSettings?.phone || defaultSettings.phone,
    email: siteSettings?.email || defaultSettings.email,
    address: siteSettings?.address || defaultSettings.address,
    city: siteSettings?.city || defaultSettings.city,
  };

  return (
    <footer className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-20 relative overflow-hidden">
      {/* Декоративный элемент */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-orange-500 via-orange-600 to-orange-500"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* О компании */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <h3 className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600">
                {settings.title}
              </h3>
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-md">
              {settings.description}
            </p>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <FaHeart className="text-orange-500" size={14} />
              <span>Сделано с любовью для вас</span>
            </div>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-orange-500 rounded-full"></span>
              Контакты
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 group">
                <div className="mt-0.5 p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                  <FaPhone className="text-orange-500" size={14} />
                </div>
                <div>
                  <a 
                    href={`tel:${settings.phone?.replace(/\s+/g, '')}`}
                    className="text-slate-300 hover:text-orange-400 transition-colors text-sm block"
                  >
                    {settings.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="mt-0.5 p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                  <FaEnvelope className="text-orange-500" size={14} />
                </div>
                <div>
                  <a 
                    href={`mailto:${settings.email}`}
                    className="text-slate-300 hover:text-orange-400 transition-colors text-sm block break-all"
                  >
                    {settings.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="mt-0.5 p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                  <FaMapMarkerAlt className="text-orange-500" size={14} />
                </div>
                <div>
                  <span className="text-slate-300 text-sm block">
                    {settings.address}
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Быстрые ссылки */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-orange-500 rounded-full"></span>
              Информация
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="flex items-center gap-3 text-slate-300 hover:text-orange-400 transition-colors text-sm group"
                >
                  <FaHome className="text-orange-500/50 group-hover:text-orange-500 transition-colors" size={14} />
                  <span>Главная</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="flex items-center gap-3 text-slate-300 hover:text-orange-400 transition-colors text-sm group"
                >
                  <FaInfoCircle className="text-orange-500/50 group-hover:text-orange-500 transition-colors" size={14} />
                  <span>О нас</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/contacts" 
                  className="flex items-center gap-3 text-slate-300 hover:text-orange-400 transition-colors text-sm group"
                >
                  <FaAddressBook className="text-orange-500/50 group-hover:text-orange-500 transition-colors" size={14} />
                  <span>Контакты</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Нижняя часть футера */}
        <div className="border-t border-slate-700/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} BurgerFood. Все права защищены.
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <span>Версия 1.0.0</span>
              <span>•</span>
              <span>Сделано в Кыргызстане</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

