import { FaHamburger, FaChartBar, FaCog, FaSignOutAlt } from 'react-icons/fa';

interface HeaderProps {
  showSettings: boolean;
  setShowSettings: (val: boolean) => void;
  showStats: boolean;
  setShowStats: (val: boolean) => void;
  userName: string | null;
}

export const Header = ({ showSettings, setShowSettings, showStats, setShowStats, userName }: HeaderProps) => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <FaHamburger className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">BURGER<span className="text-orange-500">FOOD</span></h1>
            <p className="text-xs text-slate-500">Панель управления</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setShowStats(!showStats)} className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm flex items-center gap-2">
            <FaChartBar /> <span className="hidden sm:inline">Статистика</span>
          </button>
          <button onClick={() => setShowSettings(!showSettings)} className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
            <FaCog />
          </button>
          
          {showSettings && (
            <div className="absolute right-4 top-16 bg-white shadow-2xl border rounded-xl p-4 z-50 w-48">
              <p className="font-bold text-sm">{userName}</p>
              <button onClick={handleLogout} className="mt-4 w-full flex items-center gap-2 text-red-600 font-bold text-sm">
                <FaSignOutAlt /> Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};