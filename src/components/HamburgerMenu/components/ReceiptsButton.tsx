import { FaReceipt } from "react-icons/fa"

interface Props {
  onClick: () => void
}

export const ReceiptsButton = ({ onClick }: Props) => {

  return (

    <button onClick={onClick}>

      <div>

        <FaReceipt size={18} />

      </div>

      <div>

        <h3>
          Мои заказы
        </h3>

        <p>
          История заказов
        </p>

      </div>

    </button>

  )

}