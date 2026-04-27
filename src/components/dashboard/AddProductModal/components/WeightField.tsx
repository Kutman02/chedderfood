import React from "react"
import { FaBox } from "react-icons/fa"

interface WeightFieldProps {
  weight: string
  setWeight: (value: string) => void
  showHint?: boolean
}

export const WeightField: React.FC<WeightFieldProps> = ({
  weight,
  setWeight,
  showHint = true,
}) => {

  return (

    <div>

      <label className="text-sm font-black text-slate-700 mb-2 flex items-center gap-2">
        <FaBox />
        Вес (граммы)
      </label>

      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder="0"
        min="0"
        step="1"
        className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-orange-500 outline-none"
      />

      {showHint && (
        <p className="text-xs text-slate-500 mt-1">
          Укажите вес товара в граммах (необязательно)
        </p>
      )}

    </div>

  )

}