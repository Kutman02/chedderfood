import { FooterCompany } from "./components/FooterCompany"
import { FooterContacts } from "./components/FooterContacts"
import { FooterLinks } from "./components/FooterLinks"
import { FooterBottom } from "./components/FooterBottom"
import { useGetSiteFooterQuery } from "@/api"
import type { FooterLink } from "@/types"

const DEFAULT_LINKS: FooterLink[] = [
  { label: "Главная", url: "/" },
  { label: "О нас", url: "/about" },
  { label: "Контакты", url: "/contacts" },
]

const normalizeFooterLabel = (label: string | undefined, fallback: string) => {
  const normalized = (label || "").trim()
  if (!normalized) return fallback

  const withoutNumericSuffix = normalized.replace(/\s*\d+$/, "").trim()
  return withoutNumericSuffix || fallback
}

const normalizeFooterPath = (
  url: string | undefined,
  label: string,
  fallback: string
) => {
  const normalizedUrl = (url || "").trim()
  if (!normalizedUrl) return fallback

  if (/^https?:\/\//i.test(normalizedUrl)) {
    return normalizedUrl
  }

  const normalizedPath = normalizedUrl.startsWith("/")
    ? normalizedUrl
    : `/${normalizedUrl}`

  const path = normalizedPath.split(/[?#]/)[0].toLowerCase()

  if (path === "/" || path === "/home" || path === "/main" || path === "/index") {
    return "/"
  }

  if (path.startsWith("/about")) {
    return "/about"
  }

  if (path.startsWith("/contact")) {
    return "/contacts"
  }

  const normalizedLabel = label.toLowerCase()

  if (normalizedLabel.includes("глав")) {
    return "/"
  }

  if (normalizedLabel.includes("о нас")) {
    return "/about"
  }

  if (normalizedLabel.includes("конт")) {
    return "/contacts"
  }

  return fallback
}

const sanitizeFooterLinks = (links: FooterLink[] | undefined): FooterLink[] => {
  const sourceLinks = Array.isArray(links) && links.length
    ? links
    : DEFAULT_LINKS

  return DEFAULT_LINKS.map((defaultLink, index) => {
    const sourceLink = sourceLinks[index] ?? defaultLink
    const label = normalizeFooterLabel(sourceLink.label, defaultLink.label)

    return {
      label,
      url: normalizeFooterPath(sourceLink.url, label, defaultLink.url),
    }
  })
}

export const PublicFooter = () => {
  const { data: footerResponse, isLoading } = useGetSiteFooterQuery()

  // Default settings for fallback
  const defaultSettings = {
    company: {
      title: "KutMenu",
      description:
        "Лучшая еда с доставкой на дом. Свежие ингредиенты, быстрая доставка, отличный сервис. Мы заботимся о каждом клиенте и гарантируем качество.",
    },
    contacts: {
      phone: "+996777777777",
      email: "restoran@gmail.com",
      address: "Бишкек, Кыргызстан",
    },
    links: DEFAULT_LINKS,
    bottom: {
      copyrightText: "© 2026 KutMenu. Все права защищены.",
      versionText: "Версия 1.0.0",
      countryText: "Сделано в Кыргызстане",
    },
  }

  const footerData = footerResponse?.data || defaultSettings
  const footerLinks = sanitizeFooterLinks(footerData.links)

  if (isLoading) {
    return (
      <footer className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-orange-500 via-orange-600 to-orange-500"></div>
        <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
          <div className="animate-pulse">
            <div className="h-20 bg-slate-700 rounded mb-6"></div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-20 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-orange-500 via-orange-600 to-orange-500"></div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          <FooterCompany
            title={footerData.company.title}
            description={footerData.company.description || ""}
          />

          <FooterContacts
            phone={footerData.contacts.phone}
            email={footerData.contacts.email}
            address={footerData.contacts.address}
          />

          <FooterLinks links={footerLinks} />

        </div>

        <FooterBottom
          title={footerData.company.title}
          copyrightText={footerData.bottom.copyrightText}
          versionText={footerData.bottom.versionText}
          countryText={footerData.bottom.countryText}
        />

      </div>
    </footer>
  )
}