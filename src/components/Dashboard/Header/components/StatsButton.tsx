import { FaChartBar } from "react-icons/fa"

interface Props {
  showStats: boolean
  setShowStats: (val: boolean) => void
}

export const StatsButton = ({
  showStats,
  setShowStats
}: Props) => {

  return (

    <button
      onClick={() => setShowStats(!showStats)}
      className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm flex items-center gap-2"
    >

      <FaChartBar />

      <span className="hidden sm:inline">
        Статистика
      </span>

    </button>

  )

}