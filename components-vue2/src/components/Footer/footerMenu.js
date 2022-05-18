const footerMenu = [
  {
    title: "Автострахование",
    titleRef: "/individual/auto/",

    items: [
      { title: "ОСАГО", ref: "/individual/auto/osago/" },
      { title: "Каско", ref: "/individual/auto/kasko/" },
      { title: "Зеленая карта", ref: "/individual/auto/greencard/" },
    ],
  },

  {
    title: "Имущество",
    titleRef: "/individual/property/",

    items: [
      { title: "Квартира", ref: "/individual/property/flat/" },
      { title: "Дом", ref: "/individual/property/reso-dom/" },
      { title: " Ипотека", ref: "/individual/property/ipoteka/" },
    ],
  },

  {
    title: "Жизнь и здоровье",
    titleRef: "/individual/",

    items: [
      { title: "ДМС", ref: "/individual/property/flat/" },
      { title: "Туризм", ref: "/individual/travel/" },
      { title: "Несчастный случай", ref: "/individual/accident/" },
      {
        title: "Накопительное и инвестиционное страхование",
        ref: "/individual/life/",
      },
    ],
  },

  {
    title: "О компании",
    titleRef: "/about/",
    items: [
      { title: "Новости", ref: "/about/news/" },
      { title: "Вакансии", ref: "/about/career/" },
      { title: "Закупки", ref: "/about/tenders/" },
      {
        title: "Раскрытие сведений",
        ref: "/investors/disclosure/",
      },
      {
        title: "Информация для потребителей",
        ref: "/about/consumer-information/",
      },
      { title: "Правила и тарифы", ref: "/about/consumer-information/rules/" },
      { title: "Карта сайта", ref: "/sitemap" },
    ],
  },
];

export default footerMenu;
