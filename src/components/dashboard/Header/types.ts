export interface HeaderProps {
  showSettings: boolean
  setShowSettings: (val: boolean) => void
  userName: string | null
  searchValue: string
  searchPlaceholder: string
  searchEnabled: boolean
  onSearchChange: (value: string) => void
  searchMeta: {
    found: number
    total: number
    loading?: boolean
  }
}
