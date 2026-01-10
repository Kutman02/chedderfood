import type { TabConfig } from '../../types/types';

interface TabNavigationProps {
  tabs: TabConfig[];
  activeTab: string;
  setActiveTab: (id: string) => void;
  ordersCount: number; // Количество заказов в текущей вкладке
}

export const TabNavigation = ({ tabs, activeTab, setActiveTab, ordersCount }: TabNavigationProps) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200/50 sticky top-34.25 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-3 py-4 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-3 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-300 min-w-35 ${
                  isActive 
                    ? `bg-linear-to-r ${tab.color} text-white shadow-md transform scale-[1.02]` 
                    : `bg-white text-slate-600 hover:bg-slate-50 border-2 ${tab.borderColor}`
                }`}
              >
                <tab.icon className="text-lg" />
                <div className="flex flex-col items-start">
                  <span>{tab.label}</span>
                  {isActive && ordersCount > 0 && (
                    <span className="text-[10px] font-bold text-white/90">
                      {ordersCount} заказов
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};