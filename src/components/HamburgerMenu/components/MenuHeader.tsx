import { FaTimes } from "react-icons/fa"

interface Props {
  onClose: () => void
}

export const MenuHeader = ({ onClose }: Props) => (

  <div>

    <h2>
      Меню
    </h2>

    <button onClick={onClose}>
      <FaTimes size={20} />
    </button>

  </div>

)