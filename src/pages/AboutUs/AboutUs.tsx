import { PublicHeader } from "@/components/PublicHeader/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter/PublicFooter";
import { useGetAboutPageQuery } from "@/api";
import type { AboutPageData } from "@/types";

import { HeroSection } from "./components/HeroSection";
import { HistorySection } from "./components/HistorySection";
import { AdvantagesSection } from "./components/AdvantagesSection";
import { ValuesSection } from "./components/ValuesSection";

const defaultAboutData: AboutPageData = {
  hero: {
    title: "О нас",
    subtitle:
      "KutMenu - это не просто доставка еды, это любовь к качественной пище и забота о наших клиентах",
  },
  history: {
    title: "Наша история",
    paragraphs: [
      "KutMenu был основан с простой идеей - доставлять вкусную, свежую еду прямо к вашей двери. Мы верим, что каждый заслуживает наслаждаться качественной пищей, не выходя из дома.",
      "Наша команда состоит из опытных поваров, которые используют только свежие ингредиенты и готовят каждое блюдо с любовью и вниманием к деталям. Мы постоянно улучшаем наши рецепты и расширяем меню, чтобы предложить вам лучший выбор.",
      "С момента открытия мы стремимся к тому, чтобы каждый заказ был идеальным. Наша миссия - сделать качественную еду доступной для всех, кто ценит вкус и удобство.",
    ],
  },
  advantages: {
    title: "Почему выбирают нас",
    items: [
      {
        icon: "utensils",
        title: "Свежие ингредиенты",
        description:
          "Мы используем только свежие и качественные продукты от проверенных поставщиков",
      },
      {
        icon: "shipping",
        title: "Быстрая доставка",
        description:
          "Доставляем заказы быстро и аккуратно, сохраняя температуру и свежесть блюд",
      },
      {
        icon: "heart",
        title: "С любовью к делу",
        description:
          "Каждое блюдо готовится с вниманием к деталям и заботой о вашем удовольствии",
      },
      {
        icon: "award",
        title: "Гарантия качества",
        description:
          "Мы гарантируем качество каждого блюда и готовы исправить любые недочеты",
      },
    ],
  },
  values: {
    title: "Наши ценности",
    items: [
      {
        title: "Качество",
        description:
          "Мы никогда не идем на компромиссы в вопросах качества. Каждое блюдо должно быть идеальным.",
      },
      {
        title: "Клиентоориентированность",
        description:
          "Наши клиенты - наш приоритет. Мы слушаем ваши отзывы и постоянно улучшаем сервис.",
      },
      {
        title: "Инновации",
        description:
          "Мы ищем новые способы сделать заказ и доставку еще более удобными и приятными.",
      },
    ],
  },
};

const AboutUs = () => {
  const { data: aboutResponse } = useGetAboutPageQuery();

  const aboutData = aboutResponse?.data || defaultAboutData;

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        <HeroSection
          title={aboutData.hero.title}
          subtitle={aboutData.hero.subtitle}
        />

        <div className="max-w-7xl mx-auto px-4 py-16">
          <HistorySection
            title={aboutData.history.title}
            paragraphs={aboutData.history.paragraphs}
          />
          <AdvantagesSection
            title={aboutData.advantages.title}
            items={aboutData.advantages.items}
          />
          <ValuesSection
            title={aboutData.values.title}
            items={aboutData.values.items}
          />
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default AboutUs;