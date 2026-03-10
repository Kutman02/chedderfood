import { ORDER_TABS } from "../constants/dashboard.constants";

type OrderTabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export const OrderTabs = ({
  activeTab,
  setActiveTab,
}: OrderTabsProps) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 mb-6">
      {ORDER_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === tab.id
              ? `bg-linear-to-r ${tab.color} text-white shadow-lg scale-105`
              : "bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <tab.icon />
          {tab.label}
        </button>
      ))}
    </div>
  );
};