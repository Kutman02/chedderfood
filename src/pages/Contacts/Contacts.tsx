import { PublicHeader } from "@/components/PublicHeader/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter/PublicFooter";
import { useGetContactsPageQuery } from "@/api";
import type { ContactsPageData } from "@/types";

import { HeroSection } from "./components/HeroSection";
import { ContactInfoSection } from "./components/ContactInfoSection";
import { LocationSection } from "./components/LocationSection";

const defaultContactsData: ContactsPageData = {
  hero: {
    title: "Контакты",
    subtitle: "Свяжитесь с нами любым удобным способом. Мы всегда рады помочь!",
  },
  contact_info: {
    section_title: "Свяжитесь с нами",
    section_description:
      "Есть вопросы или предложения? Мы всегда рады общению с нашими клиентами. Выберите удобный для вас способ связи.",
    phone: {
      number: "+996 770 51 11 11",
      note: "Звонки принимаются ежедневно",
    },
    email: {
      address: "kutmank9@gmail.com",
      note: "Ответим в течение 24 часов",
    },
    address: {
      street: "Курманжан датка 12",
      city: "Ош, Кыргызстан",
    },
    working_hours: {
      days: "Понедельник - Воскресенье",
      hours: "09:00 - 22:00",
    },
  },
  messengers: {
    whatsapp: "996703601025",
    telegram: "kutmenu",
  },
  location: {
    title: "Наше местоположение",
    street: "Курманжан датка 12",
    city: "Ош, Кыргызстан",
    directions_text:
      "Мы находимся в центре города Ош, на улице Курманжан датка, дом 12. К нам легко добраться как на общественном транспорте, так и на личном автомобиле. Рядом есть удобная парковка.",
    google_maps_embed_url: "",
  },
};

const Contacts = () => {
  const { data: contactsResponse } = useGetContactsPageQuery();

  const contactsData = contactsResponse?.data || defaultContactsData;

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        <HeroSection
          title={contactsData.hero.title}
          subtitle={contactsData.hero.subtitle}
        />

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactInfoSection
              info={contactsData.contact_info}
              messengers={contactsData.messengers}
            />
            <LocationSection location={contactsData.location} />
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default Contacts;