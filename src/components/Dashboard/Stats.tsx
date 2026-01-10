import { FaBox, FaDollarSign, FaChartLine } from 'react-icons/fa';

interface StatsProps {
  stats: {
    count: number;
    total: number;
  };
}

export const Stats = ({ stats }: StatsProps) => {
  const averageCheck = stats.count > 0 ? (stats.total / stats.count).toFixed(0) : 0;

  return (
    <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Заказы */}
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs font-bold opacity-90 mb-0.5">Заказов сегодня</p>
              <p className="text-2xl font-black">{stats.count}</p>
            </div>
            <FaBox className="text-3xl opacity-30" />
          </div>

          {/* Сумма */}
          <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs font-bold opacity-90 mb-0.5">Сумма сегодня</p>
              <p className="text-2xl font-black">{stats.total.toFixed(0)} сом</p>
            </div>
            <FaDollarSign className="text-3xl opacity-30" />
          </div>

          {/* Средний чек */}
          <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs font-bold opacity-90 mb-0.5">Средний чек</p>
              <p className="text-2xl font-black">{averageCheck} сом</p>
            </div>
            <FaChartLine className="text-3xl opacity-30" />
          </div>
        </div>
      </div>
    </div>
  );
};