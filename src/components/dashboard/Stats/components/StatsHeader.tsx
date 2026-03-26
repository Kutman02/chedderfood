import { FaCalendarAlt } from "react-icons/fa"
import { format, subDays } from "date-fns"
import { useNavigate } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"



export interface StatsHeaderProps {
  startDate: string
  endDate: string
  setStartDate: (v: string) => void
  setEndDate: (v: string) => void
}


export const StatsHeader = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate
}: StatsHeaderProps) => {

  const handleQuickRange = (days: number) => {

    const end = new Date()
    const start = subDays(end, days)

    setEndDate(format(end, "yyyy-MM-dd"))
    setStartDate(format(start, "yyyy-MM-dd"))

  }
const navigate = useNavigate()
  const getDateRangeText = () => {

    const start = format(new Date(startDate), "dd.MM.yyyy")
    const end = format(new Date(endDate), "dd.MM.yyyy")

    return `${start} — ${end}`

  }

  return (

    <div className="bg-white border-b border-slate-200 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">

        <h1 className="text-xl sm:text-2xl font-black text-slate-800">
          Статистика
        </h1>

        {/* Быстрые диапазоны */}

        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 w-full sm:w-auto">
          

          <button
            onClick={() => handleQuickRange(7)}
            className="flex-1 sm:flex-initial px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-white transition-all"
          >
            7 дней
          </button>

          <button
            onClick={() => handleQuickRange(30)}
            className="flex-1 sm:flex-initial px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-white transition-all"
          >
            30 дней
          </button>

          <button
            onClick={() => handleQuickRange(90)}
            className="flex-1 sm:flex-initial px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-white transition-all"
          >
            90 дней
          </button>

        </div>

        {/* Выбор дат */}

        <div className="flex items-center gap-2 w-full sm:w-auto">

          <input
            type="date"
            value={startDate}
            max={endDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="flex-1 sm:flex-initial px-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <span className="text-slate-500 hidden sm:inline">
            —
          </span>

          <input
            type="date"
            value={endDate}
            min={startDate}
            max={format(new Date(), "yyyy-MM-dd")}
            onChange={(e) => setEndDate(e.target.value)}
            className="flex-1 sm:flex-initial px-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* Отображение диапазона */}

        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">

          <FaCalendarAlt size={12} />

          <span>{getDateRangeText()}</span>

        </div>

      </div>

      {/* Кнопка закрытия */}

    <button
  onClick={() => navigate(-1)}
  className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition"
>
  <FaArrowLeft size={12} />
  Назад
</button>


    </div>

  )

}