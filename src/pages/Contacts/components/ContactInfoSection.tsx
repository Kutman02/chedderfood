import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import type { ContactsInfoSection, ContactsMessengers } from "@/types";
import { MessengerSection } from "./MessengerSection";

interface ContactInfoSectionProps {
  info: ContactsInfoSection;
  messengers: ContactsMessengers;
}

export const ContactInfoSection = ({ info, messengers }: ContactInfoSectionProps) => {
  const phoneHref = `tel:${info.phone.number.replace(/[^\d+]/g, "")}`;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div>
        <h2 className="text-3xl font-black text-slate-800 mb-8">
          {info.section_title}
        </h2>

        <p className="text-lg text-slate-600 mb-8">
          {info.section_description}
        </p>
      </div>

      <div className="space-y-6">
        {/* Телефон */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
              <FaPhone className="text-orange-600" size={20} />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Телефон
              </h3>

              <a
                href={phoneHref}
                className="text-orange-600 hover:text-orange-700 font-medium text-lg"
              >
                {info.phone.number}
              </a>

              <p className="text-sm text-slate-600 mt-1">
                {info.phone.note}
              </p>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
              <FaEnvelope className="text-orange-600" size={20} />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Email
              </h3>

              <a
                href={`mailto:${info.email.address}`}
                className="text-orange-600 hover:text-orange-700 font-medium break-all"
              >
                {info.email.address}
              </a>

              <p className="text-sm text-slate-600 mt-1">
                {info.email.note}
              </p>
            </div>
          </div>
        </div>

        {/* Адрес */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
              <FaMapMarkerAlt className="text-orange-600" size={20} />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Адрес
              </h3>

              <p className="text-slate-700 font-medium">
                {info.address.street}
                <br />
                {info.address.city}
              </p>
            </div>
          </div>
        </div>

        {/* Время работы */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
              <FaClock className="text-orange-600" size={20} />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Время работы
              </h3>

              <div className="space-y-1 text-slate-700">
                <p className="font-medium">{info.working_hours.days}</p>
                <p className="text-slate-600">{info.working_hours.hours}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MessengerSection messengers={messengers} />
    </div>
  );
};