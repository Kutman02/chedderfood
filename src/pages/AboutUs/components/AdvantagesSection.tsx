import type { AboutAdvantageItem } from "@/types";
import { FaUtensils, FaShippingFast, FaHeart, FaAward } from "react-icons/fa";

const iconByKey = {
  utensils: FaUtensils,
  shipping: FaShippingFast,
  heart: FaHeart,
  award: FaAward,
};

interface AdvantagesSectionProps {
  title: string;
  items: AboutAdvantageItem[];
}

const AdvantagesSection = ({ title, items }: AdvantagesSectionProps) => {
  return (
    <section className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-100">
      <h2 className="text-3xl font-black text-slate-800 mb-8 text-center">
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, index) => {
          const Icon =
            iconByKey[item.icon as keyof typeof iconByKey] || FaUtensils;

          return (
            <div
              key={`${index}-${item.title}`}
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="text-orange-600" size={24} />
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {item.title}
              </h3>

              <p className="text-slate-600">
                {item.description}
              </p>
            </div>
          );
        })}

      </div>
    </section>
  );
};

export { AdvantagesSection };