import { useEffect, useRef, useState } from "react"
import { FaSearch, FaTimes } from "react-icons/fa"

interface HeaderSearchProps {
  value: string
  placeholder: string
  enabled: boolean
  onChange: (value: string) => void
  searchMeta: {
    found: number
    total: number
    loading?: boolean
  }
}

export const HeaderSearch = ({
  value,
  placeholder,
  enabled,
  onChange,
  searchMeta,
}: HeaderSearchProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isOpen = isExpanded || value.length > 0

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const targetNode = event.target as Node | null

      if (!targetNode || !containerRef.current) {
        return
      }

      if (!containerRef.current.contains(targetNode) && !value) {
        setIsExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("touchstart", handleOutsideClick)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("touchstart", handleOutsideClick)
    }
  }, [value])

  if (!enabled) {
    return null
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        aria-label="Открыть поиск"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
      >
        <FaSearch size={14} />
      </button>
    )
  }

  return (
    <div
      ref={containerRef}
      className="w-[min(60vw,22rem)] sm:w-[20rem] md:w-[24rem]"
    >
      <div className="relative">
        <FaSearch
          size={13}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          ref={inputRef}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape" && !value) {
              setIsExpanded(false)
            }
          }}
          aria-label="Поиск в текущем разделе"
          title="Поиск в текущем разделе"
          className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-10 text-sm text-slate-700 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
        />

        <button
          onClick={() => {
            if (value) {
              onChange("")
              return
            }
            setIsExpanded(false)
          }}
          aria-label={value ? "Очистить поиск" : "Свернуть поиск"}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <FaTimes size={12} />
        </button>
      </div>

      <p className="mt-1 text-xs text-slate-500">
        {searchMeta.loading
          ? "Ищем..."
          : value.trim()
          ? `Найдено: ${searchMeta.found} из ${searchMeta.total}`
          : `Всего в разделе: ${searchMeta.total}`}
      </p>
    </div>
  )
}
