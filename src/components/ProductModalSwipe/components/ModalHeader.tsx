import { IoIosArrowDown } from "react-icons/io";


interface ModalHeaderProps {
  onClose: () => void
}

export const ModalHeader = ({ onClose }: ModalHeaderProps) => {
  return (
    <div className="absolute top-0 left-0 z-20 md:hidden pointer-events-none safe-area-top">

      <button
        onClick={onClose}
        aria-label="Закрыть"
        className="mt-3 ml-3 h-10 w-10 flex items-center justify-center text-slate-700 hover:text-black transition-colors rounded-full shrink-0 pointer-events-auto bg-white/90 backdrop-blur shadow-md"
      >
        <IoIosArrowDown size={20} />
      </button>
    </div>
  )
}