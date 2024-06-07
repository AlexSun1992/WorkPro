import Vue from "vue";
import { mount, createLocalVue } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import Header from "./Header.vue";
import "../../../../utils/map/currentCity";

jest.mock("../../../../utils/map/currentCity", () => ({
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

    expect(wrapper.find("[data-testid=cabinetLoginDropDown]").text()).toContain(
      "Иванов Иван"
    );
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

    expect(
      wrapper.find("[data-testid=cabinetLoginDropDown]").text()
    ).not.toContain("Иванов Иван");
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

    expect(
      wrapper.find("[data-testid=cabinetLoginDropDown]").text()
    ).not.toContain("Иванов Иван");
  });
});
