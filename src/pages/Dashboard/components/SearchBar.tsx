type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  placeholder: string
}

export const SearchBar = ({
  value,
  onChange,
  placeholder,
}: SearchBarProps) => {

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-4 rounded-xl border-2 border-slate-200 outline-none focus:border-orange-500 mb-6"
    />
  )

}