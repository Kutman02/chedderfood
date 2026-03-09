interface Props {
  onClick: () => void
}

export const MenuOverlay = ({ onClick }: Props) => (

  <div
    className="absolute inset-0 bg-black/50 animate-in fade-in duration-300"
    onClick={onClick}
  />

)