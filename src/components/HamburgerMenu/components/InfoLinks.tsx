import { Link } from "react-router-dom"
import { FaInfoCircle, FaAddressBook } from "react-icons/fa"

interface Props {
  onClose: () => void
}

export const InfoLinks = ({ onClose }: Props) => {

  return (

    <div>

      <h3>
        Информация
      </h3>

      <div>

        <Link
          to="/about"
          onClick={onClose}
        >

          <div>
            <FaInfoCircle />
          </div>

          <div>
            <h3>О нас</h3>
            <p>
              Узнайте больше о BurgerFood
            </p>
          </div>

        </Link>

        <Link
          to="/contacts"
          onClick={onClose}
        >

          <div>
            <FaAddressBook />
          </div>

          <div>
            <h3>Контакты</h3>
            <p>
              Свяжитесь с нами
            </p>
          </div>

        </Link>

      </div>

    </div>

  )

}