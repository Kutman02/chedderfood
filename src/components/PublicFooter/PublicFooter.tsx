import { FooterCompany } from "./components/FooterCompany"
import { FooterContacts } from "./components/FooterContacts"
import { FooterLinks } from "./components/FooterLinks"
import { FooterBottom } from "./components/FooterBottom"

export const PublicFooter = () => {
  const settings = {
    title: "KutMenu",
    description:
      "Лучшая еда с доставкой на дом. Свежие ингредиенты, быстрая доставка, отличный сервис. Мы заботимся о каждом клиенте и гарантируем качество.",
    phone: "+996703601025",
    email: "kutmank9@gmail.com",
    address: "Бишкек, Кыргызстан",
    city: "Кыргызстан",
  }

  return (
    <footer className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-20 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-orange-500 via-orange-600 to-orange-500"></div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          <FooterCompany
            title={settings.title}
            description={settings.description}
          />

          <FooterContacts
            phone={settings.phone}
            email={settings.email}
            address={settings.address}
          />

          <FooterLinks />

        </div>

        <FooterBottom title={settings.title} />

      </div>
    </footer>
  )
}