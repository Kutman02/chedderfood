const ValuesSection = () => {
  return (
    <section className="bg-linear-to-br from-orange-50 to-slate-50 rounded-2xl p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-200">
      <h2 className="text-3xl font-black text-slate-800 mb-8 text-center">
        Наши ценности
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">
            Качество
          </h3>

          <p className="text-slate-600 leading-relaxed">
            Мы никогда не идем на компромиссы в вопросах качества.
            Каждое блюдо должно быть идеальным.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">
            Клиентоориентированность
          </h3>

          <p className="text-slate-600 leading-relaxed">
            Наши клиенты - наш приоритет.
            Мы слушаем ваши отзывы и постоянно улучшаем сервис.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">
            Инновации
          </h3>

          <p className="text-slate-600 leading-relaxed">
            Мы ищем новые способы сделать заказ и доставку
            еще более удобными и приятными.
          </p>
        </div>
      </div>
    </section>
  );
};

export { ValuesSection };