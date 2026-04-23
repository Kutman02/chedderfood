import { Link } from "react-router-dom"
import { FaHome, FaInfoCircle, FaAddressBook } from "react-icons/fa"
import type { FooterLink } from "@/types"

interface FooterLinksProps {
  links: FooterLink[]
}

const getIconForUrl = (url: string) => {
  const normalizedUrl = url.toLowerCase()

  if (normalizedUrl === "/" || normalizedUrl.includes("home")) return FaHome
  if (normalizedUrl.includes("about")) return FaInfoCircle
  if (normalizedUrl.includes("contact")) return FaAddressBook

  return FaHome
}

export const FooterLinks = ({ links }: FooterLinksProps) => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-5 text-white flex items-center gap-2">
        <span className="w-1 h-5 bg-orange-500 rounded-full"></span>
        Информация
      </h3>

      <ul className="space-y-3">
        {links.map((link, index) => {
          const Icon = getIconForUrl(link.url)
          const isExternal = /^https?:\/\//i.test(link.url.trim())

          if (isExternal) {
            return (
              <li key={index}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-300 hover:text-orange-400 transition-colors text-sm group"
                >
                  <Icon
                    className="text-orange-500/50 group-hover:text-orange-500 transition-colors"
                    size={14}
                  />
                  <span>{link.label}</span>
                </a>
              </li>
            )
          }

          return (
            <li key={index}>
              <Link
                to={link.url}
                className="flex items-center gap-3 text-slate-300 hover:text-orange-400 transition-colors text-sm group"
              >
                <Icon
                  className="text-orange-500/50 group-hover:text-orange-500 transition-colors"
                  size={14}
                />
                <span>{link.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}