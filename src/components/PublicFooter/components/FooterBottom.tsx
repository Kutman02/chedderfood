interface FooterBottomProps {
  title: string
  copyrightText?: string
  versionText?: string
  countryText?: string
}

export const FooterBottom = ({
  title,
  copyrightText,
  versionText,
  countryText,
}: FooterBottomProps) => {
  const defaultCopyright = `© ${new Date().getFullYear()} ${title}. Все права защищены.`
  const defaultVersion = "Версия 1.0.0"
  const defaultCountry = "Сделано в Кыргызстане"

  return (
    <div className="border-t border-slate-700/50 mt-12 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        <p className="text-slate-400 text-sm text-center md:text-left">
          {copyrightText || defaultCopyright}
        </p>

        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <span>{versionText || defaultVersion}</span>
          <span>•</span>
          <span>{countryText || defaultCountry}</span>
        </div>

      </div>
    </div>
  )
}