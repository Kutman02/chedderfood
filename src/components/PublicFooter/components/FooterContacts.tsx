import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"

interface FooterContactsProps {
  phone: string
  email: string
  address: string
}

export const FooterContacts = ({
  phone,
  email,
  address,
}: FooterContactsProps) => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-5 text-white flex items-center gap-2">
        <span className="w-1 h-5 bg-orange-500 rounded-full"></span>
        Контакты
      </h3>

      <ul className="space-y-3">
        <li className="flex items-start gap-3 group">
          <div className="mt-0.5 p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
            <FaPhone className="text-orange-500" size={14} />
          </div>

          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="text-slate-300 hover:text-orange-400 transition-colors text-sm"
          >
            {phone}
          </a>
        </li>

        <li className="flex items-start gap-3 group">
          <div className="mt-0.5 p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
            <FaEnvelope className="text-orange-500" size={14} />
          </div>

          <a
            href={`mailto:${email}`}
            className="text-slate-300 hover:text-orange-400 transition-colors text-sm break-all"
          >
            {email}
          </a>
        </li>

        <li className="flex items-start gap-3 group">
          <div className="mt-0.5 p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
            <FaMapMarkerAlt className="text-orange-500" size={14} />
          </div>

          <span className="text-slate-300 text-sm">{address}</span>
        </li>
      </ul>
    </div>
  )
}