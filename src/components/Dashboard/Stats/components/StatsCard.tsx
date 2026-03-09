import type { IconType } from "react-icons"

interface Props {
  title: string
  value: string | number
  icon: IconType
  gradient: string
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  gradient
}: Props) => {

  return (

    <div className={`bg-linear-to-br ${gradient} rounded-xl p-4 text-white shadow-lg flex items-center justify-between`}>

      <div>
        <p className="text-xs font-bold opacity-90 mb-0.5">
          {title}
        </p>

        <p className="text-2xl font-black">
          {value}
        </p>
      </div>

      <Icon className="text-3xl opacity-30" />

    </div>

  )

}