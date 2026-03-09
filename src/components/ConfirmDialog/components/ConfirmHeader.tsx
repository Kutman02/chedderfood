import { FaExclamationTriangle } from "react-icons/fa"

interface Props {
  title: string
}

export const ConfirmHeader = ({ title }: Props) => {

  return (

    <div className="border-b border-slate-200 p-4">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <FaExclamationTriangle
            className="text-red-600"
            size={20}
          />
        </div>

        <h3 className="text-lg font-bold text-slate-800">
          {title}
        </h3>

      </div>

    </div>

  )

}