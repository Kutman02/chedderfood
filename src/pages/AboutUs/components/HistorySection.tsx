interface HistorySectionProps {
  title: string;
  paragraphs: string[];
}

const HistorySection = ({ title, paragraphs }: HistorySectionProps) => {
  return (
    <section className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-3xl font-black text-slate-800 mb-6">
        {title}
      </h2>

      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        {paragraphs.map((paragraph, index) => (
          <p
            key={`${index}-${paragraph.slice(0, 20)}`}
            className={`text-lg text-slate-700 leading-relaxed ${
              index < paragraphs.length - 1 ? "mb-6" : ""
            }`}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
};

export { HistorySection };