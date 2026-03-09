interface FooterBottomProps {
  title: string
}

export const FooterBottom = ({ title }: FooterBottomProps) => {
  return (
    <div className="border-t border-slate-700/50 mt-12 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        <p className="text-slate-400 text-sm text-center md:text-left">
          © {new Date().getFullYear()} {title}. Все права защищены.
        </p>

        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <span>Версия 1.0.0</span>
          <span>•</span>
          <span>Сделано в Кыргызстане</span>
        </div>

      </div>
    </div>
  )
}