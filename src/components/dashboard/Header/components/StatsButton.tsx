import { FaChartBar } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

export const StatsButton = () => {

  const navigate = useNavigate()

  return (

    <button
      onClick={() => navigate("/dashboard/stats")}
      className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm flex items-center gap-2"
    >

      <FaChartBar />

      <span className="hidden sm:inline">
        Статистика
      </span>

    </button>

  )

}
