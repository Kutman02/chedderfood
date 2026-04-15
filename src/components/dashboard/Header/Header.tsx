import type { HeaderProps } from "./types"

import { Logo } from "./components/Logo"
import { HeaderActions } from "./components/HeaderActions"
import { HeaderSearch } from "./components/HeaderSearch"

export const Header = ({
  showSettings,
  setShowSettings,
  userName,
  searchValue,
  searchPlaceholder,
  searchEnabled,
  onSearchChange,
  searchMeta,
}: HeaderProps) => {

  return (

    <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-md shadow-sm">

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">

        <Logo />

        <div className="flex-1 flex justify-end md:justify-center min-w-0">
          <HeaderSearch
            value={searchValue}
            placeholder={searchPlaceholder}
            enabled={searchEnabled}
            onChange={onSearchChange}
            searchMeta={searchMeta}
          />
        </div>

        <HeaderActions
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          userName={userName}
        />

      </div>

    </header>

  )
}
