import { shallowMount, createLocalVue } from "@vue/test-utils";
import VueRouter from "vue-router";
import BreadCrumbs from "./BreadCrumbs.vue";

const localVue = createLocalVue();
localVue.use(VueRouter);

describe("BreadCrumbs.vue", () => {
  let router;
  let wrapper;

  beforeEach(() => {
    router = new VueRouter({
      routes: [
        { path: "/home", name: "home" },
        { path: "/about", name: "about" },
      ],
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  const createComponent = (dataSet) => {
    wrapper = shallowMount(BreadCrumbs, {
      localVue,
      router,
      propsData: {
        data: dataSet,
      },
    });
  };

  const dataSetToLink = [
    { text: "Home", to: "/home" },
    { text: "About", to: "/about" },
  ];

  const dataSetHrefLink = [
    { text: "Home", to: "/home" },
    { text: "External", href: "https://example.com" },
  ];
  it("рендерится корректно", () => {
    createComponent(dataSetToLink);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("ul").exists()).toBe(true);
    expect(wrapper.findAll("li").length).toBe(2);
  });

  it("отображает router-link для элементов с to", () => {
    createComponent(dataSetHrefLink);
    const links = wrapper.findAll("router-link-stub");
    expect(links.at(0).text()).toBe("Home");
    expect(links.at(0).attributes("to")).toBe("/home");
  });

  it("отображает обычную ссылку для элементов с href", () => {
    createComponent(dataSetHrefLink);
    const links = wrapper.findAll("a");
    expect(links.length).toBe(1);
    expect(links.at(0).text()).toBe("External");
    expect(links.at(0).attributes("href")).toBe("https://example.com");
  });

  it("устанавливает disabled атрибут для текущего маршрута", async () => {
    router.push("/home");

    createComponent(dataSetToLink);
    await wrapper.vm.$nextTick();

    const links = wrapper.findAll("router-link-stub");
    expect(links.at(0).attributes("disabled")).toBeUndefined();
    expect(links.at(1).attributes("disabled")).toBeDefined();
  });

  it("работает с пустым массивом данных", () => {
    createComponent([]);

    expect(wrapper.findAll("li").length).toBe(0);
  });
});
