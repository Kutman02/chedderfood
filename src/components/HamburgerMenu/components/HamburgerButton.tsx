import { FaBars } from "react-icons/fa"

interface Props {
  onClick: () => void
}

export const HamburgerButton = ({ onClick }: Props) => (

  <button onClick={onClick}>
    <FaBars size={20} />
  </button>

)