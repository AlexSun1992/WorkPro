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
      { title: "ДМС", ref: "/individual/medicine/" },
      { title: "Туризм", ref: "/individual/travel/" },
      { title: "Несчастный случай", ref: "/individual/accident/" },
      { title: "Антиклещ", ref: "/individual/medicine/tick/" },
      { title: "Телемедицина", ref: "/individual/medicine/telemedicine/" },
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
      { title: "Новости", ref: "/about/media/news/" },
      { title: "Вакансии", ref: "/career/" },
      { title: "Закупки", ref: "/about/tenders/" },
      {
        title: "Раскрытие сведений",
        ref: "/shareholders/",
      },
      {
        title: "Информация для потребителей",
        ref: "/about/company/",
      },
      {
        title: "Правила и тарифы",
        ref: "/about/rules/",
      },
      { title: "Обратная связь", ref: "/feedback/" },
      { title: "Карта сайта", ref: "/sitemap/" },
      {
        title: "Заказать полис",
        ref: "/aux/invokeagent.html",
      },
    ],
  },

  {
    title: "AppGoogleStoreRefs",
    items: [
      {
        class: "btn-light btn-icon icon-ios",
        ref: "https://apps.apple.com/us/app/resomobile/id1127266069",
        title: "Apple Store",
      },
      {
        class: "btn-light btn-icon icon-android",
        ref: "https://play.google.com/store/apps/details?id=ru.reso.app",
        title: "Google Play",
      },
    ],
  },

  {
    title: "socialNetworks",
    items: [
      // {
      //   class: "footer-fb",
      //   ref: "https://ru-ru.facebook.com/reso.ru",
      // },
      {
        class: "footer-vk",
        ref: "http://vk.com/reso_garantia",
      },
      // {
      //   class: "footer-in",
      //   ref: "https://www.instagram.com/reso.ru_official/",
      // },
    ],
  },
];

export default footerMenu;
