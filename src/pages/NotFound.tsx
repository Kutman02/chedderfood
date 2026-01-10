import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Автоматический редирект на главную страницу через 3 секунды
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-orange-50 to-slate-100 px-4">
      <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* 404 Текст */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-orange-500 mb-4 animate-pulse">
            404
          </h1>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Страница не найдена
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
            К сожалению, запрошенная вами страница не существует. 
            Вы будете автоматически перенаправлены на главную страницу через несколько секунд.
          </p>
        </div>

        {/* Анимация поиска */}
        <div className="mb-8">
          <div className="inline-block relative">
            <FaSearch className="text-6xl text-slate-400 animate-pulse" />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Кнопка возврата домой */}
        <button
          onClick={handleGoHome}
          className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-700 transition-all duration-300 ease-out flex items-center gap-3 mx-auto active:scale-95 shadow-lg hover:shadow-xl"
        >
          <FaHome />
          Перейти на главную
        </button>

        {/* Обратный отсчет */}
        <div className="mt-8">
          <p className="text-sm text-slate-500">
            Автоматический переход через <span className="font-bold text-orange-500">3</span> секунды...
          </p>
          <div className="w-48 h-2 bg-slate-200 rounded-full mx-auto mt-2 overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full animate-pulse animate-in shrink-x-0 duration-3000"></div>
          </div>
        </div>
      </div>

      {/* Дополнительная анимация для фона */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-slate-300 rounded-full opacity-20 animate-pulse" 
             style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-orange-300 rounded-full opacity-20 animate-pulse" 
             style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default NotFound;
