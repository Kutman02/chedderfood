import { FaHamburger } from "react-icons/fa"

export const Logo = () => {

  return (

    <div className="flex items-center gap-3">

      <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
        <FaHamburger className="text-white" />
      </div>

      <div>
        <h1 className="text-xl font-black text-slate-900">
          Kut<span className="text-orange-500">Menu</span>
        </h1>

        <p className="text-xs text-slate-500">
          Панель управления
        </p>
      </div>

    </div>

  )

}