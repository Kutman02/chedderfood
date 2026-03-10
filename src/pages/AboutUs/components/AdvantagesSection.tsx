import { FaUtensils, FaShippingFast, FaHeart, FaAward } from "react-icons/fa";

const AdvantagesSection = () => {
  return (
    <section className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-100">
      <h2 className="text-3xl font-black text-slate-800 mb-8 text-center">
        Почему выбирают нас
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUtensils className="text-orange-600" size={24} />
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Свежие ингредиенты
          </h3>

          <p className="text-slate-600">
            Мы используем только свежие и качественные продукты от проверенных поставщиков
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaShippingFast className="text-orange-600" size={24} />
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Быстрая доставка
          </h3>

          <p className="text-slate-600">
            Доставляем заказы быстро и аккуратно, сохраняя температуру и свежесть блюд
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaHeart className="text-orange-600" size={24} />
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-2">
            С любовью к делу
          </h3>

          <p className="text-slate-600">
            Каждое блюдо готовится с вниманием к деталям и заботой о вашем удовольствии
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaAward className="text-orange-600" size={24} />
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Гарантия качества
          </h3>

          <p className="text-slate-600">
            Мы гарантируем качество каждого блюда и готовы исправить любые недочеты
          </p>
        </div>

      </div>
    </section>
  );
};

export { AdvantagesSection };