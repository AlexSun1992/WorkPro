import Vue from "vue";
import { mount, createLocalVue, RouterLinkStub } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import Header from "./Header.vue";
import "@/utils/map/currentCity";

jest.mock("@/utils/map/currentCity", () => ({
  get: jest.fn(),
}));

describe("Header", () => {
  let wrapper;

  beforeEach(async () => {
    Vue.use(BootstrapVue);
    process.server = true;
    global.eventHandler = () => null;
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Отображаются имя и фамилия", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    wrapper = mount(Header, {
      localVue,
      mocks: {
        $auth: {
          loggedIn: true,
          user: {
            BSEX: 1,
            DBIRTHDATE: "1999-11-10 00:00:00.0",
            ID: 804016,
            IDAUTHTYPE: 2,
            IDMEDPARTNER: 5613877,
            KLADR_REG: 50000036000015000,
            NPROFILEFULLNESS: 90,
            SEMAIL: "egmen@yandex.ru",
            SFIRSTNAME: "Иван",
            SPHONE: "9857080752",
            SSECONDNAME: "Иванов",
            STHIRDNAME: "Иванович",
            SUSERNAME: "9857080752",
          },
        },
      },
    });

    expect(wrapper.find("[data-testid=cabinetLoginDropDown]").text()).toContain("Иванов Иван");
  });

  it("Не отображаются имя и фамилия, если null", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    wrapper = mount(Header, {
      localVue,
      mocks: {
        $auth: {
          loggedIn: true,
          user: null,
        },
      },
    });

    expect(wrapper.find("[data-testid=cabinetLoginDropDown]").text()).not.toContain("Иванов Иван");
  });

  it("Не отображаются имя и фамилия, если {}", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    wrapper = mount(Header, {
      localVue,
      mocks: {
        $auth: {
          loggedIn: true,
          user: {},
        },
      },
    });

    expect(wrapper.find("[data-testid=cabinetLoginDropDown]").text()).not.toContain("Иванов Иван");
  });

  describe("getRedirectUrl", () => {
    const getWrapper = () => mount(Header, {
        stubs: {
          NuxtLink: RouterLinkStub,
        },
        mocks: {
          $auth: {
            loggedIn: true,
            user: {},
          },
        },
      });

    test("Должен вернуться корректный URL", async () => {
      const url = "/cabinet/55/0/701";
      wrapper = getWrapper();

      wrapper.vm.$axios = {
        // eslint-disable-next-line
        post: () => new Promise((res, rej) => res({ data: [{ SLINK: url }] })),
      };

      const result = await wrapper.vm.getRedirectUrl();

      expect(result.href).toBe(`http://localhost${url}`);
    });

    test("Должена вернуться пустаая строка при получении невалидно URL с бэка", async () => {
      wrapper = getWrapper();

      wrapper.vm.$axios = {
        // eslint-disable-next-line
        post: () => new Promise((res, rej) => res({ data: [{ SLINK: "/123" }] })),
      };

      const result = await wrapper.vm.getRedirectUrl();

      expect(result?.href).toBe(
        "https://client.reso.ru/wp-reso-ru/login.xhtml?utm_source=reso.ru&utm_medium=button&utm_campaign=lk_auth"
      );
    });
  });
});
