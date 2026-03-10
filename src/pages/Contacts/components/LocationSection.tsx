import { FaMapMarkerAlt } from "react-icons/fa";

export const LocationSection = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 delay-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 h-full">
        
        <h2 className="text-2xl font-black text-slate-800 mb-6">
          Наше местоположение
        </h2>

        <div className="bg-slate-100 rounded-xl h-96 flex items-center justify-center mb-6">
          <div className="text-center">
            <FaMapMarkerAlt className="text-orange-600 mx-auto mb-4" size={48} />

            <p className="text-slate-600 font-medium">
              Курманжан датка 12
            </p>

            <p className="text-slate-500 text-sm">
              Ош, Кыргызстан
            </p>
          </div>

          {/* Здесь можно вставить Google Maps iframe */}
        </div>

        <div className="bg-orange-50 rounded-xl p-6">
          <h3 className="font-bold text-slate-800 mb-3">
            Как нас найти
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed">
            Мы находимся в центре города Ош, на улице Курманжан датка, дом 12.
            К нам легко добраться как на общественном транспорте, так и на
            личном автомобиле. Рядом есть удобная парковка.
          </p>
        </div>

      </div>
    </div>
  );
};