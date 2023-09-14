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
      {
        title: "Ответственность перед <br>соседями",
        ref: "/individual/property/go/",
      },
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
      {
        class: "footer-fb",
        ref: "https://ru-ru.facebook.com/reso.ru",
      },
      {
        class: "footer-vk",
        ref: "http://vk.com/reso_garantia",
      },
      {
        class: "footer-in",
        ref: "https://www.instagram.com/reso.ru_official/",
      },
    ],
  },
];

export default footerMenu;

// export const AppGoogleStoreRefs = [
//   {
//     class: "btn-light btn-icon icon-ios",
//     ref: "https://apps.apple.com/us/app/resomobile/id1127266069",
//     title: "Apple Store",
//   },
//   {
//     class: "btn-light btn-icon icon-android",
//     ref: "https://play.google.com/store/apps/details?id=ru.reso.app",
//     title: "Google Play",
//   },
// ];
