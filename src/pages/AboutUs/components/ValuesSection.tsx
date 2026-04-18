import type { AboutValueItem } from "@/types";

interface ValuesSectionProps {
  title: string;
  items: AboutValueItem[];
}

const ValuesSection = ({ title, items }: ValuesSectionProps) => {
  return (
    <section className="bg-linear-to-br from-orange-50 to-slate-50 rounded-2xl p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-200">
      <h2 className="text-3xl font-black text-slate-800 mb-8 text-center">
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item, index) => (
          <div key={`${index}-${item.title}`}>
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              {item.title}
            </h3>

            <p className="text-slate-600 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export { ValuesSection };