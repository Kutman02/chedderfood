import { Link } from "react-router-dom"
import { FaHeart } from "react-icons/fa"

interface FooterCompanyProps {
  title: string
  description: string
}

export const FooterCompany = ({
  title,
  description,
}: FooterCompanyProps) => {
  return (
    <div className="lg:col-span-2">
      <Link to="/" className="inline-block mb-4">
        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600">
          {title}
        </h3>
      </Link>

      <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-md">
        {description}
      </p>

      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <FaHeart className="text-orange-500" size={14} />
        <span>Сделано с любовью для вас</span>
      </div>
    </div>
  )
}