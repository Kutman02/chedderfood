import type { SearchBarProps } from "./types"

export const SearchBar = ({
  value,
  onChange,
  placeholder
}: SearchBarProps) => {

  return (

    <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200/50 sticky top-18.25 z-40">

      <div className="max-w-7xl mx-auto px-4 py-4">

        <div className="relative">

          <input
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />

          {value && (
            <button
              onClick={() => onChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
            >
              ✕
            </button>
          )}

        </div>

      </div>

    </div>

  )

}
