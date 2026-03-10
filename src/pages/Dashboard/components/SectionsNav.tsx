import { MAIN_SECTIONS } from "../constants/dashboard.constants";

type SectionsNavProps = {
  mainSection: string;
  setMainSection: (section: string) => void;
};

export const SectionsNav = ({
  mainSection,
  setMainSection,
}: SectionsNavProps) => {
  return (
    <div className="flex gap-3 mb-6 overflow-x-auto pb-4">
      {MAIN_SECTIONS.map((section) => (
        <button
          key={section.id}
          onClick={() => setMainSection(section.id)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
            mainSection === section.id
              ? `bg-linear-to-r ${section.color} text-white shadow-lg scale-105`
              : "bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <section.icon />
          {section.label}
        </button>
      ))}
    </div>
  );
};