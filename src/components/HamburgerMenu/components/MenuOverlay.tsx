interface Props {
  onClick: () => void
}

export const MenuOverlay = ({ onClick }: Props) => (

  <div
    onClick={onClick}
    className="
      fixed inset-0
      bg-black/40
      backdrop-blur-sm
      transition-opacity
    "
  />

)