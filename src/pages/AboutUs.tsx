import { PublicHeader } from '../components/PublicHeader';
import { PublicFooter } from '../components/PublicFooter';
import { FaUtensils, FaShippingFast, FaHeart, FaAward } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      
      <main className="flex-1">
        {/* Герой секция */}
        <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h1 className="text-5xl md:text-6xl font-black mb-6">О нас</h1>
              <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
                BurgerFood - это не просто доставка еды, это любовь к качественной пище и забота о наших клиентах
              </p>
            </div>
          </div>
        </section>

        {/* Основной контент */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* История компании */}
          <section className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-3xl font-black text-slate-800 mb-6">Наша история</h2>
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                BurgerFood был основан с простой идеей - доставлять вкусную, свежую еду прямо к вашей двери. 
                Мы верим, что каждый заслуживает наслаждаться качественной пищей, не выходя из дома.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Наша команда состоит из опытных поваров, которые используют только свежие ингредиенты 
                и готовят каждое блюдо с любовью и вниманием к деталям. Мы постоянно улучшаем наши рецепты 
                и расширяем меню, чтобы предложить вам лучший выбор.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                С момента открытия мы стремимся к тому, чтобы каждый заказ был идеальным. 
                Наша миссия - сделать качественную еду доступной для всех, кто ценит вкус и удобство.
              </p>
            </div>
          </section>

          {/* Преимущества */}
          <section className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-100">
            <h2 className="text-3xl font-black text-slate-800 mb-8 text-center">Почему выбирают нас</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUtensils className="text-orange-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Свежие ингредиенты</h3>
                <p className="text-slate-600">Мы используем только свежие и качественные продукты от проверенных поставщиков</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShippingFast className="text-orange-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Быстрая доставка</h3>
                <p className="text-slate-600">Доставляем заказы быстро и аккуратно, сохраняя температуру и свежесть блюд</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHeart className="text-orange-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">С любовью к делу</h3>
                <p className="text-slate-600">Каждое блюдо готовится с вниманием к деталям и заботой о вашем удовольствии</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaAward className="text-orange-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Гарантия качества</h3>
                <p className="text-slate-600">Мы гарантируем качество каждого блюда и готовы исправить любые недочеты</p>
              </div>
            </div>
          </section>

          {/* Ценности */}
          <section className="bg-gradient-to-br from-orange-50 to-slate-50 rounded-2xl p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-200">
            <h2 className="text-3xl font-black text-slate-800 mb-8 text-center">Наши ценности</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Качество</h3>
                <p className="text-slate-600 leading-relaxed">
                  Мы никогда не идем на компромиссы в вопросах качества. Каждое блюдо должно быть идеальным.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Клиентоориентированность</h3>
                <p className="text-slate-600 leading-relaxed">
                  Наши клиенты - наш приоритет. Мы слушаем ваши отзывы и постоянно улучшаем сервис.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Инновации</h3>
                <p className="text-slate-600 leading-relaxed">
                  Мы ищем новые способы сделать заказ и доставку еще более удобными и приятными.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default AboutUs;

