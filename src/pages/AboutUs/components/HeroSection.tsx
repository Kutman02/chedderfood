const HeroSection = () => {
  return (
    <section className="bg-linear-to-br from-orange-500 to-orange-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            О нас
          </h1>

          <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
            KutMenu - это не просто доставка еды, это любовь к качественной пище 
            и забота о наших клиентах
          </p>
        </div>
      </div>
    </section>
  );
};

export { HeroSection };