import { FaSearch } from "react-icons/fa"

interface Props {
  value: string
  onChange: (value: string) => void
}

export const SearchInput = ({ value, onChange }: Props) => {

  return (

    <>
      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

      <input
        type="text"
        placeholder="Поиск по номеру заказа, имени или телефону..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-medium bg-white shadow-sm"
      />
    </>

  )

}