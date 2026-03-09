import { FaShoppingCart, FaDollarSign } from "react-icons/fa"

interface Props {
  sortBy: "orders" | "spent"
  setSortBy: (v: "orders" | "spent") => void
}

export const ClientsSortPanel = ({
  sortBy,
  setSortBy
}: Props) => {

  return (

    <div className="flex items-center gap-2 mb-6">

      <span className="text-sm font-bold text-slate-600">
        Сортировка:
      </span>

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

    </div>

  )

}