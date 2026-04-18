import { FaMapMarkerAlt } from "react-icons/fa";
import type { ContactsLocation } from "@/types";

interface LocationSectionProps {
  location: ContactsLocation;
}

export const LocationSection = ({ location }: LocationSectionProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 delay-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 h-full">
        
        <h2 className="text-2xl font-black text-slate-800 mb-6">
          {location.title}
        </h2>

        {location.google_maps_embed_url ? (
          <iframe
            src={location.google_maps_embed_url}
            title="Google Maps"
            className="w-full h-96 rounded-xl mb-6 border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="bg-slate-100 rounded-xl h-96 flex items-center justify-center mb-6">
            <div className="text-center">
              <FaMapMarkerAlt className="text-orange-600 mx-auto mb-4" size={48} />

              <p className="text-slate-600 font-medium">
                {location.street}
              </p>

              <p className="text-slate-500 text-sm">
                {location.city}
              </p>
            </div>
          </div>
        )}

        <div className="bg-orange-50 rounded-xl p-6">
          <h3 className="font-bold text-slate-800 mb-3">
            Как нас найти
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed">
            {location.directions_text}
          </p>
        </div>

      </div>
    </div>
  );
};