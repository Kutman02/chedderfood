import { FaSearch, FaTimes } from 'react-icons/fa';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200/50 sticky top-18.25 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск по номеру заказа, имени или телефону..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-medium bg-white shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
            >
              <FaTimes size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};