import { Link } from "react-router-dom"
import { FaInfoCircle, FaAddressBook } from "react-icons/fa"

interface Props {
  onClose: () => void
}

export const InfoLinks = ({ onClose }: Props) => {

  return (

    <div className="space-y-4">

      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
        Информация
      </h3>

      <div className="space-y-3">

        <Link
          to="/about"
          onClick={onClose}
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition"
        >

          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600">
            <FaInfoCircle size={16}/>
          </div>

          <div className="flex flex-col">
            <h4 className="font-medium text-slate-800">
              О нас
            </h4>
            <p className="text-xs text-slate-500">
              Узнайте больше о KutMenu
            </p>
          </div>

        </Link>

        <Link
          to="/contacts"
          onClick={onClose}
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition"
        >

          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600">
            <FaAddressBook size={16}/>
          </div>

          <div className="flex flex-col">
            <h4 className="font-medium text-slate-800">
              Контакты
            </h4>
            <p className="text-xs text-slate-500">
              Свяжитесь с нами
            </p>
          </div>

        </Link>

      </div>

    </div>

  )

}