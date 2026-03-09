import { Link } from "react-router-dom"
import { FaInfoCircle, FaAddressBook } from "react-icons/fa"

interface Props {
  onClose: () => void
}

export const InfoLinks = ({ onClose }: Props) => {

  return (

    <div className="border-t border-slate-200 pt-6">

      <h3 className="font-bold text-slate-800 mb-4">
        Информация
      </h3>

      <div className="space-y-3">

        <Link
          to="/about"
          onClick={onClose}
          className="flex items-center gap-4 p-4 bg-white rounded-2xl border"
        >

          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <FaInfoCircle className="text-orange-600"/>
          </div>

          <div>
            <h3 className="font-bold">О нас</h3>
            <p className="text-sm text-slate-600">
              Узнайте больше о BurgerFood
            </p>
          </div>

        </Link>

        <Link
          to="/contacts"
          onClick={onClose}
          className="flex items-center gap-4 p-4 bg-white rounded-2xl border"
        >

          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <FaAddressBook className="text-orange-600"/>
          </div>

          <div>
            <h3 className="font-bold">Контакты</h3>
            <p className="text-sm text-slate-600">
              Свяжитесь с нами
            </p>
          </div>

        </Link>

      </div>

    </div>

  )

}