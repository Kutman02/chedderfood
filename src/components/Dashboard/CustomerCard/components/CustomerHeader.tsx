import { FaUser } from "react-icons/fa"

interface Props {
  fullName: string
}

export const CustomerHeader = ({ fullName }: Props) => {

  return (

    <div className="flex items-start justify-between mb-4">

      <div className="flex items-center gap-3">

        <div className="w-14 h-14 rounded-xl bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-black">
          <FaUser />
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900">
            {fullName}
          </h3>
        </div>

      </div>

    </div>

  )

}