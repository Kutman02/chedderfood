import { FaShoppingCart, FaDollarSign } from "react-icons/fa"

interface Props {
  orders: number
  spent: number
}

export const CustomerStats = ({
  orders,
  spent
}: Props) => {

  return (

    <div className="flex gap-4 pt-4 border-t border-slate-200">

      <div className="flex-1 bg-blue-50 rounded-lg p-3">

        <div className="flex items-center gap-2 mb-1">
          <FaShoppingCart className="text-blue-600" size={14} />
          <span className="text-xs font-bold text-slate-600 uppercase">
            Заказов
          </span>
        </div>

        <p className="text-lg font-black text-blue-600">
          {orders}
        </p>

      </div>

      <div className="flex-1 bg-green-50 rounded-lg p-3">

        <div className="flex items-center gap-2 mb-1">
          <FaDollarSign className="text-green-600" size={14} />
          <span className="text-xs font-bold text-slate-600 uppercase">
            Потрачено
          </span>
        </div>

        <p className="text-lg font-black text-green-600">
          {spent.toFixed(0)} сом
        </p>

      </div>

    </div>

  )

}