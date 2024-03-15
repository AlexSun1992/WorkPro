import { createLocalVue, mount } from "@vue/test-utils";
import { ModalPlugin } from "bootstrap-vue";
import axios from "axios";
import LoginForm from "./LoginForm.vue";
import { createMockMobileId } from "./loginForm.helper.fixtures";

jest.mock("axios");
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(),
  })
);

describe("LoginForm", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("На странице появляется окно для ввода номера паспорта", async () => {
    global.window = Object.create(window);
    Object.defineProperty(window, "location", {
      value: {
        href: "http://localhost/login?type=mobileid&state=ce5e41e9-69cd-43b9-9e50-f7edd4e53771",
      },
    });

    fetch.mockReturnValue(
      Promise.resolve(
        createMockMobileId({ errorText: "Нужен паспорт", statusCode: 520 })
      )
    );
    const wrapper = mount(LoginForm);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(fetch).toHaveBeenCalledWith("/am/free/v2/datacard/55/804", {
      body: '{"state":"ce5e41e9-69cd-43b9-9e50-f7edd4e53771"}',
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });
    expect(wrapper.find(".passport-number").exists()).toBe(true);
  });

  it("Происходит повторный вызов окна ввода паспорта т.к. пасспорт в 1ый раз был заполнен неправильно", async () => {
    global.window = Object.create(window);
    Object.defineProperty(window, "location", {
      value: {
        href: "http://localhost/login?type=mobileid&state=ce5e41e9-69cd-43b9-9e50-f7edd4e53771",
      },
    });

    fetch.mockReturnValue(
      Promise.resolve(
        createMockMobileId({ errorText: "Нужен паспорт", statusCode: 520 })
      )
    );
    const wrapper = mount(LoginForm);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(fetch).toHaveBeenCalledTimes(1);

    await wrapper.findComponent(".passport-number").setValue("1234");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.find("#sendPassport").trigger("submit.prevent");
    fetch.mockReturnValue(
      Promise.resolve(
        createMockMobileId({ errorText: "Нужен паспорт", statusCode: 520 })
      )
    );

    expect(fetch).toHaveBeenCalledWith("/am/free/v2/datacard/55/804", {
      body: '{"state":"ce5e41e9-69cd-43b9-9e50-f7edd4e53771","passport":"1234"}',
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });
    expect(wrapper.find(".passport-number").exists()).toBe(true);
  });

  it("Выводим ошибку в dialog", async () => {
    global.window = Object.create(window);
    Object.defineProperty(window, "location", {
      value: {
        href: "http://localhost/login?type=mobileid&state=ce5e41e9-69cd-43b9-9e50-f7edd4e53771",
      },
    });

    fetch.mockReturnValue(
      Promise.resolve(
        createMockMobileId({
          errorText: "Повторите попытку ввода паспорта",
          statusCode: 520,
        })
      )
    );
    const wrapper = mount(LoginForm);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(wrapper.find("[data-testid=dialogErrorInformation]").text()).toBe(
      "Повторите попытку ввода паспорта"
    );
  });

  it("Выводим ошибку в dialog и добавляем disabled на кнопку и инпут", async () => {
    global.window = Object.create(window);
    Object.defineProperty(window, "location", {
      value: {
        href: "http://localhost/login?type=mobileid&state=ce5e41e9-69cd-43b9-9e50-f7edd4e53771",
      },
    });

    fetch.mockReturnValue(
      Promise.resolve(
        createMockMobileId({
          errorText: "Превышено количество попыток",
          statusCode: 520,
        })
      )
    );
    const wrapper = mount(LoginForm);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(wrapper.find("[data-testid=dialogErrorInformation]").text()).toBe(
      "Превышено количество попыток"
    );
    expect(wrapper.find(".passport-number").attributes("disabled")).toBe(
      "disabled"
    );
    expect(wrapper.find("#sendPassport").attributes("disabled")).toBe(
      "disabled"
    );
  });

  it("Закрываем dialog по клику", async () => {
    global.window = Object.create(window);
    Object.defineProperty(window, "location", {
      value: {
        href: "http://localhost/login?type=mobileid&state=ce5e41e9-69cd-43b9-9e50-f7edd4e53771",
      },
    });
    fetch.mockReturnValue(
      Promise.resolve(
        createMockMobileId({
          errorText: "Превышено количество попыток",
          statusCode: 520,
        })
      )
    );
    const wrapper = mount(LoginForm);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(fetch).toHaveBeenCalledTimes(1);
    await wrapper.find("[data-testid=closeDialog]").trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".passport-number").exists()).toBe(false);
    expect(fetch).not.toHaveBeenCalledTimes(2);
  });

  it("На странице не появляется окно для ввода номер паспорта и происходит redirect /cabinet", async () => {
    global.window = Object.create(window);
    Object.defineProperty(window, "location", {
      value: {
        href: "http://localhost/login?type=mobileid&state=ce5e41e9-69cd-43b9-9e50-f7edd4e53771",
      },
    });

    fetch.mockReturnValue(
      Promise.resolve(
        createMockMobileId({
          statusCode: 200,
        })
      )
    );
    const wrapper = mount(LoginForm, {
      mocks: {
        $cookiz: {
          get: jest.fn().mockReturnValue("/cabinet"),
          set: jest.fn(),
        },
      },
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(wrapper.find(".passport-number").exists()).toBe(false);
    expect(window.location.href).toEqual("/cabinet");
  });

  it("На странице не появляется окно для ввода номер паспорта ", async () => {
    global.window = Object.create(window);
    Object.defineProperty(window, "location", {
      value: {
        href: "http://localhost/login",
      },
    });

    const wrapper = mount(LoginForm);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(fetch).toHaveBeenCalledTimes(0);
    expect(wrapper.find(".passport-number").exists()).toBe(false);
  });

  it("должен показать кнопку авторизоваться", () => {
    const wrapper = mount(LoginForm);
    expect(wrapper.text()).toContain("Авторизоваться");
  });

  it("должен выводить ошибку логина + пароля", async () => {
    const wrapper = mount(LoginForm);
    axios.post.mockImplementationOnce(() => {
      const wrongAuthError = new Error("");
      wrongAuthError.response = {
        data: {
          MESSAGE: "Неверные учетные данные пользователя",
          STATUS: 401,
          CODE: 101,
          CODENAME: "Invalid",
        },
      };
      throw wrongAuthError;
    });

    await wrapper.find("#phone").setValue("ege@mmd.ru");
    await wrapper.find("#password").setValue("182821");
    await wrapper.find("#auth-form").trigger("submit.prevent");

    expect(wrapper.text()).toContain("Неверный логин или пароль");
  });

  it("должен показать только одну капчу", async () => {
    const wrapper = mount(LoginForm);

    axios.post.mockImplementationOnce(() => {
      const wrongAuthError = new Error("");
      wrongAuthError.response = {
        data: {
          MESSAGE: "Заполните капчу",
          STATUS: 401,
          NEEDCAPTCHA: true,
          CODE: 106,
          CODENAME: "CaptchaRequest",
        },
      };
      throw wrongAuthError;
    });
    axios.get.mockReturnValue(() => ({
      data: {
        CAPTCHA: "data:image/png;base64",
        ID: 943824,
      },
    }));

    await wrapper.find("#phone").setValue("ege@mmd.ru");
    await wrapper.find("#password").setValue("182821");
    await wrapper.find("#auth-form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent("#auth-form img.captcha").exists()).toBe(true);
    expect(
      wrapper.findComponent("#sms-confirm-modal img.captcha").exists()
    ).toBe(false);
  });

  it("не должен выводить ошибку логина + пароля", async () => {
    const localVue = createLocalVue();
    localVue.use(ModalPlugin);
    const wrapper = mount(LoginForm, {
      localVue,
    });
    await wrapper.find("#phone").setValue("ege@mmd.ru");
    await wrapper.find("#password").setValue("182821");

    axios.post.mockImplementationOnce(() => {
      const wrongAuthError = new Error("");
      wrongAuthError.response = {
        data: {
          MESSAGE: "Введите код подтверждения из SMS.",
          STATUS: 401,
          CODE: 104,
          NEEDCODE: true,
          SMSPHONE: "+7 (ХХХ) ХХХ-94-91",
          CODENAME: "PhoneCodeRequest",
          AUTHCODE: 2,
        },
      };
      throw wrongAuthError;
    });
    await wrapper.find("#auth-form").trigger("submit.prevent");

    expect(wrapper.find("#phone").classes()).not.toContain("is-invalid");
    expect(wrapper.text()).not.toContain("Неверный логин или пароль");
  });

  it("должен показывать только неверный код подтверждения", async () => {
    const localVue = createLocalVue();
    localVue.use(ModalPlugin);
    const wrapper = mount(LoginForm, {
      localVue,
      attachTo: document.body,
    });
    const modal = wrapper.findComponent("#sms-confirm-modal");
    await wrapper.find("#phone").setValue("ege@mmd.ru");
    await wrapper.find("#password").setValue("182821");

    axios.post.mockImplementationOnce(() => {
      const wrongAuthError = new Error("");
      wrongAuthError.response = {
        data: {
          MESSAGE: "Введите код подтверждения из SMS.",
          STATUS: 401,
          CODE: 104,
          NEEDCODE: true,
          SMSPHONE: "+7 (ХХХ) ХХХ-94-91",
          CODENAME: "PhoneCodeRequest",
          AUTHCODE: 2,
        },
      };
      throw wrongAuthError;
    });

    expect(modal.isVisible()).toBe(false);
    expect(wrapper.find("#phone").classes()).toContain("is-valid");

    await wrapper.find("#auth-form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();

    expect(modal.isVisible()).toBe(true);
    expect(wrapper.find("#phone").classes()).toContain("is-valid");

    expect(modal.isVisible()).toBe(true);
    await modal.find("#sms-code").setValue("12345");

    axios.post.mockImplementationOnce(() => {
      const wrongAuthError = new Error("");
      wrongAuthError.response = {
        data: {
          MESSAGE: "Неверный код подтверждения",
          STATUS: 401,
          CODE: 105,
          NEEDCODE: true,
          CODENAME: "InvalidPhoneCode",
          AUTHCODE: 2,
        },
      };
      throw wrongAuthError;
    });
    await wrapper.find("#sms-form").trigger("submit.prevent");

    expect(modal.find("#sms-code").classes()).toContain("is-invalid");
    expect(wrapper.find("#phone").classes()).not.toContain("is-invalid");
    expect(wrapper.text()).not.toContain("Неверный логин или пароль");
  });

  it("должен показывать текст из API в модалке", async () => {
    const localVue = createLocalVue();
    localVue.use(ModalPlugin);
    const wrapper = mount(LoginForm, {
      localVue,
      attachTo: document.body,
    });
    const modal = wrapper.findComponent("#sms-confirm-modal");
    await wrapper.find("#phone").setValue("ege@mmd.ru");
    await wrapper.find("#password").setValue("182821");
    axios.post.mockImplementationOnce(() => {
      const wrongAuthError = new Error("");
      wrongAuthError.response = {
        data: {
          MESSAGE: "Введите код подтверждения из SMS.",
          STATUS: 401,
          CODE: 104,
          NEEDCODE: true,
          SMSPHONE: "+7 (ХХХ) ХХХ-94-91",
          CODENAME: "PhoneCodeRequest",
          AUTHCODE: 2,
        },
      };
      throw wrongAuthError;
    });

    await wrapper.find("#auth-form").trigger("submit.prevent");

    expect(modal.text()).toContain("Введите код подтверждения из SMS");
  });

  it("не должен инвалидировать поля формы при запросе капчи", async () => {
    const wrapper = mount(LoginForm, {});
    axios.post.mockImplementationOnce(() => {
      const wrongAuthError = new Error("");
      wrongAuthError.response = {
        data: {
          MESSAGE: "Заполните капчу",
          STATUS: 401,
          NEEDCAPTCHA: true,
          CODE: 106,
          CODENAME: "CaptchaRequest",
        },
      };
      throw wrongAuthError;
    });
    axios.get.mockReturnValue(() => ({
      data: {
        CAPTCHA: "data:image/png;base64",
        ID: 943824,
      },
    }));

    await wrapper.find("#phone").setValue("ege@mmd.ru");
    await wrapper.find("#password").setValue("182821");
    await wrapper.find("#auth-form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();

    expect(wrapper.find("#phone").classes()).not.toContain("is-invalid");
  });

  it("не должен кэшировать ошибку капчи после успешного ввода", async () => {
    const wrapper = mount(LoginForm, {});
    axios.post.mockImplementationOnce(() => {
      const wrongAuthError = new Error("");
      wrongAuthError.response = {
        data: {
          MESSAGE: "Заполните капчу",
          STATUS: 401,
          NEEDCAPTCHA: true,
          CODE: 106,
          CODENAME: "CaptchaRequest",
        },
      };
      throw wrongAuthError;
    });
    axios.get.mockReturnValue(() => ({
      data: {
        CAPTCHA: "data:image/png;base64",
        ID: 943824,
      },
    }));

    await wrapper.find("#phone").setValue("ege@mmd.ru");
    await wrapper.find("#password").setValue("182821");
    await wrapper.find("#auth-form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();

    expect(wrapper.find("#captcha-form").text()).toContain("Заполните капчу");

    await wrapper.find("#captcha-code").setValue("12345");
    axios.post.mockImplementationOnce(() => {
      const wrongAuthError = new Error("");
      wrongAuthError.response = {
        data: {
          MESSAGE: "Неправильная капча",
          STATUS: 401,
          NEEDCAPTCHA: true,
          CODE: 107,
          CODENAME: "CaptchaInvalid",
        },
      };
      throw wrongAuthError;
    });
    await wrapper.find("#auth-form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();

    expect(wrapper.find("#captcha-form").text()).toContain(
      "Неправильная капча"
    );

    await wrapper.find("#captcha-code").setValue("123");
    axios.post.mockImplementationOnce(() => {
      const wrongAuthError = new Error("");
      wrongAuthError.response = {
        data: {
          MESSAGE: "Неверные учетные данные пользователя",
          STATUS: 401,
          CODE: 101,
          CODENAME: "Invalid",
        },
      };
      throw wrongAuthError;
    });
    await wrapper.find("#auth-form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();
    expect(wrapper.find("#captcha-form").text()).not.toContain(
      "Неправильная капча"
    );
  });

  it("получили неожиданный серверный ответ", async () => {
    const localVue = createLocalVue();
    localVue.use(ModalPlugin);
    const wrapper = mount(LoginForm, {
      localVue,
    });
    await wrapper.find("#phone").setValue("9032374418");
    await wrapper.find("#password").setValue("Carter911");
    axios.post.mockImplementationOnce(() => {
      const wrongAuthError = new Error("");
      wrongAuthError.response = {
        data: {
          MESSAGE:
            'ru.reso.rest.auth.helper.AuthExeption: ORA-01722: неверное число\nORA-06512: на  "I3.TBI_SMS_TURN_TEMPLATE", line 15\nORA-04088: ошибка во время выполнения триггера \'I3.TBI_SMS_TURN_TEMPLATE\'\nORA-06512: на  "V4.SMSUTILS", line 313\nORA-06512: на  "V4.SMSUTILS", line 175\nORA-06512: на  "V4.SMSUTILS", line 125\nORA-06512: на  "MOBILE.AMAUTH2", line 1146\nORA-06512: на  "MOBILE.AMAUTH2", line 1091\nORA-06512: на  line 1\n',
          STATUS: 500,
          REASON: "Internal Server Error",
        },
      };
      throw wrongAuthError;
    });
    await wrapper.find("#auth-form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain(
      "Приносим извинения, в Личном Кабинете что-то пошло не так."
    );
  });

  it("отвалился интернет", async () => {
    const localVue = createLocalVue();
    localVue.use(ModalPlugin);
    const wrapper = mount(LoginForm, {
      localVue,
    });
    await wrapper.find("#phone").setValue("9032374418");
    await wrapper.find("#password").setValue("Carter911");
    await wrapper.find("#btn_entry_lk").trigger("click");
    axios.post.mockImplementationOnce(() => {
      const wrongAuthError = new Error(
        "Cannot read properties of undefined (reading 'status') at eval"
      );
      throw wrongAuthError;
    });

    await wrapper.find("#auth-form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain(
      "Приносим извинения, в Личном Кабинете что-то пошло не так."
    );
  });
});
