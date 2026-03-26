import type { SearchBarProps } from "./types"

import { SearchInput, ClearButton } from "./components"

export const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {

  return (

    <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200/50 sticky top-18.25 z-40">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

        <div className="relative">

          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
          />

          {searchQuery && (

            <ClearButton
              onClear={() => setSearchQuery("")}
            />

          )}

        </div>

      </div>

    </div>

  )

}