// const headerMenu = ["Купить полис", "Страховой случай", "Бизнесу"];
// export default headerMenu;

const items = [
  {
    class: "product",
    titleRef: [
      {
        ref: "/individual/auto/",
        ariaCurrent: "page",
        title: "Автострахование",
        class: "router-link-exact-active router-link-active",
      },
    ],
    productLinks: [{ class: "priduct_link" }],
    productLinkRefs: [
      { title: "ОСАГО", href: "/individual/auto/osago/" },
      { title: "Каско", href: "/individual/auto/kasko/" },
      { title: "Зеленая карта", href: "/individual/auto/greencard/" },
    ],
  },
];

export default items;
