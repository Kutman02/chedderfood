const HistorySection = () => {
  return (
    <section className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-3xl font-black text-slate-800 mb-6">
        Наша история
      </h2>

      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <p className="text-lg text-slate-700 leading-relaxed mb-6">
          KutMenu был основан с простой идеей - доставлять вкусную, свежую еду прямо к вашей двери.
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
  );
};

export { HistorySection };