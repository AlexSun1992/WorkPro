import { shallowMount } from "@vue/test-utils";
import { nextTick } from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import AuthorizationForm from "./AuthorizationForm.vue";

jest.mock("axios", () => {
  const mockAxios = {
    post: jest.fn(),
  };
  return mockAxios;
});
jest.mock("js-cookie");
jest.mock("@/utils/transform", () => ({
  getErrorMessage: jest.fn().mockReturnValue("Test error message"),
}));

global.HTMLDialogElement = class HTMLDialogElement {
  showModal = jest.fn();

  close = jest.fn();

  addEventListener = jest.fn();
};

jest.mock("vue", () => {
  const actualVue = jest.requireActual("vue");

  const mockStore = {
    getters: {
      "auth/isAuthorizationModal": () => false,
      "ui/loader/isRequestsInProgress": () => false,
      "ui/loader/getShowLoader": () => false,
    },
    commit: jest.fn(),
    dispatch: jest.fn(),
    state: {
      ui: {
        loader: {},
      },
    },
  };

  const mockLogEvent = jest.fn();

  actualVue.getCurrentInstance = jest.fn(() => ({
    proxy: {
      $store: mockStore,
      $LogEvent: mockLogEvent,
    },
  }));

  return actualVue;
});
const delay = (ms = 0) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

describe("AuthorizationForm - тест реального компонента", () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    axios.post.mockReset();
    Cookies.set.mockReset();
    Cookies.get.mockReset();

    wrapper = shallowMount(AuthorizationForm, {
      stubs: {},
    });
  });

  it("рендерит компонент без ошибок", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("dialog.login-modal").exists()).toBe(true);
  });

  it("обрабатывает отправку телефона и запрос SMS", async () => {
    axios.post.mockRejectedValue({
      response: {
        data: {
          CODENAME: "CodeSmsRequest",
          CODE: 104,
          LABEL: "Введите код",
          MESSAGE: "На ваш телефон отправлен код",
          INFO: "Код отправлен в SMS",
          ERROR: "",
        },
      },
    });
    wrapper.vm.userData.username = "79991234567";

    await wrapper.vm.fetchToken();
    await delay(0);
    expect(axios.post).toHaveBeenCalledTimes(1);

    expect(axios.post).toHaveBeenCalledWith(
      "/lk/authw/v2/auth",
      { CODE: "", MODE: 2, USERNAME: "9991234567", VERSION: 2, DOP: "" },
      { headers: { "X-Application": "VueJS" } }
    );

    expect(wrapper.vm.currentStep).toBe("sms");
  });

  it("отображает кнопку закрытия на шаге телефона", () => {
    expect(wrapper.find(".close").exists()).toBe(true);
  });

  it("отправляет телефон ", async () => {
    axios.post.mockRejectedValue({
      response: {
        data: {
          CODENAME: "CodeSmsRequest",
          CODE: 104,
        },
      },
    });

    wrapper.vm.userData.username = "79991234567";

    await wrapper.vm.fetchToken();
    await delay(0);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it("обрабатывает успешную авторизацию", async () => {
    axios.post.mockResolvedValue({
      data: {
        ACCESS_TOKEN: "test-access-token",
        REFRESH_TOKEN: "test-refresh-token",
      },
    });

    const originalLocation = window.location;
    delete window.location;
    window.location = { href: "" };

    wrapper.vm.userData.username = "79991234567";
    wrapper.vm.userData.code = "12345";

    await wrapper.vm.fetchToken();
    await nextTick();

    expect(Cookies.set).toHaveBeenCalledWith("auth._token.local", "Bearer test-access-token", { expires: 1 / 24 });

    expect(Cookies.set).toHaveBeenCalledWith("auth._refresh_token.local", "test-refresh-token", { expires: 365 });

    window.location = originalLocation;
  });

  it("обрабатывает ошибку неверного кода", async () => {
    axios.post.mockRejectedValue({
      response: {
        data: {
          CODENAME: "InvalidPhoneCode",
          CODE: 105,
          ERROR: "Неверный код",
        },
      },
    });

    wrapper.vm.currentStep = "sms";
    wrapper.vm.userData.username = "79991234567";
    wrapper.vm.userData.code = "wrong";

    await wrapper.vm.fetchToken();
    await nextTick();

    expect(wrapper.vm.options.isValidStateCodeSMS).toBe(false);
  });

  it("обрабатывает переход к регистрации", async () => {
    axios.post.mockRejectedValue({
      response: {
        data: {
          CODENAME: "Registration",
          CODE: 102,
          ERROR: "Требуется регистрация",
        },
      },
    });

    wrapper.vm.userData.username = "79991234567";

    await wrapper.vm.fetchToken();
    await nextTick();

    expect(wrapper.vm.currentStep).toBe("registration");
  });

  it("закрывает модальное окно при клике на кнопку закрытия", async () => {
    await wrapper.find(".close").trigger("click");

    expect(wrapper.vm.userData.username).toBe("");
    expect(wrapper.vm.userData.code).toBe("");
    expect(wrapper.vm.currentStep).toBe("phone");
  });
});
