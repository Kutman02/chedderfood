import { Link } from 'react-router-dom';

export const PublicFooter = () => {
  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* О компании */}
          <div>
            <h3 className="text-xl font-black mb-4 text-orange-500">BurgerFood</h3>
            <p className="text-slate-400 text-sm">
              Лучшая еда с доставкой на дом. Свежие ингредиенты, быстрая доставка, отличный сервис.
            </p>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-lg font-bold mb-4">Контакты</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>📞 +996 770 51 11 11</li>
              <li>✉️ kutmank9@gmail.com</li>
              <li>📍 Ош, Кыргызстан</li>
            </ul>
          </div>

          {/* Быстрые ссылки */}
          <div>
            <h3 className="text-lg font-bold mb-4">Информация</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <Link to="/" className="hover:text-orange-500 transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-orange-500 transition-colors">
                  Вход
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} BurgerFood. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

