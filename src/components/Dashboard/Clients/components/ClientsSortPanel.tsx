import {
  FaShoppingCart,
  FaDollarSign,
  FaUser,
  FaClock
} from "react-icons/fa"

interface Props {
  sortBy: "newest" | "orders" | "spent" | "name"
  setSortBy: (value: "newest" | "orders" | "spent" | "name") => void
}

export const ClientsSortPanel = ({
  sortBy,
  setSortBy
}: Props) => {

  return (

    <div className="flex items-center gap-2 mb-6 flex-wrap">

      <span className="text-sm font-bold text-slate-600">
        Сортировка:
      </span>

      {/* NEWEST */}

      <button
        onClick={() => setSortBy("newest")}
        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
          sortBy === "newest"
            ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg"
            : "bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50"
        }`}
      >
        <FaClock className="inline mr-2" size={12}/>
        Новые
      </button>

      {/* ORDERS */}

      <button
        onClick={() => setSortBy("orders")}
        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
          sortBy === "orders"
            ? "bg-linear-to-r from-purple-500 to-purple-600 text-white shadow-lg"
            : "bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50"
        }`}
      >
        <FaShoppingCart className="inline mr-2" size={12}/>
        По заказам
      </button>

      {/* SPENT */}

      <button
        onClick={() => setSortBy("spent")}
        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
          sortBy === "spent"
            ? "bg-linear-to-r from-green-500 to-green-600 text-white shadow-lg"
            : "bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50"
        }`}
      >
        <FaDollarSign className="inline mr-2" size={12}/>
        По потраченному
      </button>

      {/* NAME */}

      <button
        onClick={() => setSortBy("name")}
        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
          sortBy === "name"
            ? "bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-lg"
            : "bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50"
        }`}
      >
        <FaUser className="inline mr-2" size={12}/>
        По имени
      </button>

    </div>

  )

}
