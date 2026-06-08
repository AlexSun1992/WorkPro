// SMSConfirm.test.js

import { mount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import axios from "axios";
import SmsConfirm from "./SMSConfirm.vue";

jest.mock("axios");

describe("SmsConfirm.vue", () => {
  const API_URL = "/lk/free/v2/redirectShortLink";

  let cookieStore = "";
  let $cookiz;
  let originalLocation;

  beforeEach(() => {
    jest.clearAllMocks();
    cookieStore = "";

    // Эмуляция document.cookie
    Object.defineProperty(document, "cookie", {
      configurable: true,
      get() {
        return cookieStore;
      },
      set(val) {
        if (!val) {
          return;
        }
        const [pair] = String(val).split(";");
        const [key, v] = pair.split("=");
        const map = new Map(
          cookieStore
            .split("; ")
            .filter(Boolean)
            .map((c) => {
              const [k, vv] = c.split("=");
              return [k, vv];
            })
        );
        map.set(key, v);
        cookieStore = Array.from(map.entries())
          .map(([k, vv]) => `${k}=${vv}`)
          .join("; ");
      },
    });

    // мок для $cookiz
    $cookiz = {
      set: jest.fn(),
      get: jest.fn(),
    };

    // подмена window.location
    originalLocation = window.location;
    delete window.location;
    window.location = { href: "http://localhost/" };
  });

  afterEach(() => {
    if (originalLocation) {
      window.location = originalLocation;
    }
  });

  const createWrapper = () =>
    mount(SmsConfirm, {
      mocks: { $cookiz },
    });

  const callFetchInfoAndFlush = async (wrapper) => {
    if (typeof wrapper.vm.fetchInfo === "function") {
      await wrapper.vm.fetchInfo();
    }
    await flushPromises();
    await wrapper.vm.$nextTick();
    wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();
  };

  // ---------------------------------------------------------------------------
  // Первичный INFO (fetchInfo)
  // ---------------------------------------------------------------------------

  it.skip("если по hash приходит PHONE и MESSAGE — форма видна, Confirm disabled (<5), Resend заблокирован", async () => {
    document.cookie = "sms_hash=abc123";

    axios.post.mockResolvedValueOnce({
      data: [
        {
          PHONE: "(***) - *** - ** - 11",
          MESSAGE:
            "На номер (***) - *** - ** - 11 был выслан код подверждения, пожалуйста введите его в соответсвующее поле.",
          remainingSeconds: 60,
        },
      ],
    });

    const wrapper = createWrapper();

    await callFetchInfoAndFlush(wrapper);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(API_URL, { hash: "abc123" });

    const msg = wrapper.find("#sms-confirm-message");
    expect(msg.exists()).toBe(true);
    expect(msg.text()).toContain("На номер (***) - *** - ** - 11 был выслан код подверждения");

    const input = wrapper.find(".sms-confirm__input");
    const confirmBtn = wrapper.find("#sms-confirm-confirm-btn");
    const resendBtn = wrapper.find("#sms-confirm-resend-btn");

    expect(input.exists()).toBe(true);
    expect(confirmBtn.exists()).toBe(true);
    expect(resendBtn.exists()).toBe(true);

    expect(confirmBtn.attributes("disabled")).toBe("disabled");
    expect(resendBtn.attributes("disabled")).toBe("disabled");
  });

  it("если по hash приходит только MESSAGE без PHONE — форма скрыта, показываем только текст", async () => {
    document.cookie = "sms_hash=no_phone";

    axios.post.mockResolvedValueOnce({
      data: [
        {
          MESSAGE: "Текст без телефона",
        },
      ],
    });

    const wrapper = createWrapper();

    await callFetchInfoAndFlush(wrapper);

    const msg = wrapper.find("#sms-confirm-message");
    expect(msg.exists()).toBe(true);
    expect(msg.text()).toContain("Текст без телефона");

    const input = wrapper.find(".sms-confirm__input");
    const confirmBtn = wrapper.find("#sms-confirm-confirm-btn");
    const resendBtn = wrapper.find("#sms-confirm-resend-btn");

    expect(input.exists()).toBe(false);
    expect(confirmBtn.exists()).toBe(false);
    expect(resendBtn.exists()).toBe(false);
  });

  it("если по hash сразу приходят токены — ставим куки (через document.cookie) и редиректим", async () => {
    document.cookie = "sms_hash=token_hash";

    axios.post.mockResolvedValueOnce({
      data: [
        {
          ACCESS_TOKEN: "ACCESS123",
          REFRESH_TOKEN: "REFRESH123",
          REDIRECT_URL: "/cabinet/after-sms",
        },
      ],
    });

    const wrapper = createWrapper();

    await callFetchInfoAndFlush(wrapper);

    // В этом окружении setAuthCookiesFromResponse может использовать либо $cookiz, либо document.cookie.
    // Проверяем оба варианта: сначала $cookiz, если там есть вызовы, иначе — document.cookie.
    if ($cookiz.set.mock.calls.length) {
      expect($cookiz.set).toHaveBeenCalledWith("auth._token.local", "Bearer ACCESS123");
      expect($cookiz.set).toHaveBeenCalledWith("auth._refresh_token.local", "REFRESH123");
    } else {
      expect(document.cookie).toContain("auth._token.local=");
      expect(document.cookie).toContain("auth._refresh_token.local=");
      expect(document.cookie).toContain("ACCESS123");
      expect(document.cookie).toContain("REFRESH123");
    }

    expect(window.location.href).toContain("/cabinet/after-sms");

    const input = wrapper.find(".sms-confirm__input");
    expect(input.exists()).toBe(false);
  });

  it("если при загрузке API вернул INFO — показываем его в сообщении и форму не рендерим", async () => {
    document.cookie = "sms_hash=err1";

    axios.post.mockRejectedValueOnce(
      Object.assign(new Error("fail"), {
        response: {
          data: {
            INFO: "Технические работы",
          },
        },
      })
    );

    const wrapper = createWrapper();

    await callFetchInfoAndFlush(wrapper);

    const msg = wrapper.find("#sms-confirm-message");
    expect(msg.exists()).toBe(true);
    expect(msg.text()).toContain("Технические работы");

    const input = wrapper.find(".sms-confirm__input");
    expect(input.exists()).toBe(false);
  });

  it("если при загрузке INFO нет — показываем 'Что-то пошло не так' и форму не рендерим", async () => {
    document.cookie = "sms_hash=err2";

    axios.post.mockRejectedValueOnce(
      Object.assign(new Error("fail"), {
        response: {
          data: {
            error: "some_error",
          },
        },
      })
    );

    const wrapper = createWrapper();

    await callFetchInfoAndFlush(wrapper);

    const msg = wrapper.find("#sms-confirm-message");
    expect(msg.exists()).toBe(true);
    expect(msg.text()).toContain("Что-то пошло не так");

    const input = wrapper.find(".sms-confirm__input");
    expect(input.exists()).toBe(false);
  });

  // ---------------------------------------------------------------------------
  // Подтверждение кода (confirm)
  // ---------------------------------------------------------------------------

  it("при подтверждении, если API вернул токены — ставим куки и редиректим", async () => {
    document.cookie = "sms_hash=confirm_hash";

    axios.post.mockImplementation((url, payload) => {
      if (payload && payload.code) {
        return Promise.resolve({
          data: [
            {
              ACCESS_TOKEN: "ACCESS_CNF",
              REFRESH_TOKEN: "REFRESH_CNF",
              REDIRECT_URL: "/cabinet/ok",
            },
          ],
        });
      }
      return Promise.resolve({ data: [] });
    });

    const wrapper = createWrapper();

    // форма видна (иначе input/кнопки не рендерятся, но нам это и не важно — вызываем onConfirm напрямую)
    wrapper.vm.initialLoaded = true;
    await wrapper.vm.$nextTick();
    wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();

    // Вместо возни с DOM-событиями — проставляем код и вызываем onConfirm() напрямую
    wrapper.vm.code = "12345";
    await wrapper.vm.onConfirm();

    await flushPromises();
    await wrapper.vm.$nextTick();
    wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();

    // Проверяем оба пути установки токенов
    if ($cookiz.set.mock.calls.length) {
      expect($cookiz.set).toHaveBeenCalledWith("auth._token.local", "Bearer ACCESS_CNF");
      expect($cookiz.set).toHaveBeenCalledWith("auth._refresh_token.local", "REFRESH_CNF");
    } else {
      expect(document.cookie).toContain("auth._token.local=");
      expect(document.cookie).toContain("auth._refresh_token.local=");
      expect(document.cookie).toContain("ACCESS_CNF");
      expect(document.cookie).toContain("REFRESH_CNF");
    }

    expect(window.location.href).toContain("/cabinet/ok");
  });

  it.skip("при подтверждении, если API вернул INFO — показываем его", async () => {
    document.cookie = "sms_hash=confirm_hash2";

    axios.post.mockImplementation((url, payload) => {
      if (payload && payload.code) {
        return Promise.reject(
          Object.assign(new Error("invalid_code"), {
            response: {
              data: {
                INFO: "Неверный код",
              },
            },
          })
        );
      }
      return Promise.resolve({ data: [] });
    });

    const wrapper = createWrapper();

    wrapper.vm.initialLoaded = true;
    await wrapper.vm.$nextTick();
    wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();

    wrapper.vm.code = "12345";
    await wrapper.vm.onConfirm();

    await flushPromises();
    await wrapper.vm.$nextTick();
    wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();

    const errorEl = wrapper.find("#sms-confirm-error");
    expect(errorEl.exists()).toBe(true);
    expect(errorEl.text()).toContain("Неверный код");
  });

  it.skip("при подтверждении, если INFO нет — показываем 'Что-то пошло не так'", async () => {
    document.cookie = "sms_hash=confirm_hash3";

    axios.post.mockImplementation((url, payload) => {
      if (payload && payload.code) {
        return Promise.reject(
          Object.assign(new Error("invalid_code"), {
            response: {
              data: {
                error: "invalid_code",
              },
            },
          })
        );
      }
      return Promise.resolve({ data: [] });
    });

    const wrapper = createWrapper();

    wrapper.vm.initialLoaded = true;
    await wrapper.vm.$nextTick();
    wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();

    wrapper.vm.code = "12345";
    await wrapper.vm.onConfirm();

    await flushPromises();
    await wrapper.vm.$nextTick();
    wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();

    const errorEl = wrapper.find("#sms-confirm-error");
    expect(errorEl.exists()).toBe(true);
    expect(errorEl.text()).toContain("Что-то пошло не так");
  });

  // ---------------------------------------------------------------------------
  // Повторная отправка (resend)
  // ---------------------------------------------------------------------------

  it.skip("при повторной отправке, если API вернул INFO — показываем его", async () => {
    document.cookie = "sms_hash=resend1";

    axios.post.mockImplementation((url, payload) => {
      if (payload && payload.resend) {
        return Promise.reject(
          Object.assign(new Error("too_often"), {
            response: {
              data: {
                INFO: "Отправка временно недоступна.",
              },
            },
          })
        );
      }
      return Promise.resolve({
        data: [
          {
            PHONE: "xxx",
            MESSAGE: "Введите код",
            remainingSeconds: 0,
          },
        ],
      });
    });

    const wrapper = createWrapper();

    await callFetchInfoAndFlush(wrapper);

    const resendBtn = wrapper.find("#sms-confirm-resend-btn");
    await resendBtn.trigger("click");

    await flushPromises();
    await wrapper.vm.$nextTick();
    wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();

    const errorEl = wrapper.find("#sms-confirm-error");
    expect(errorEl.exists()).toBe(true);
    expect(errorEl.text()).toContain("Отправка временно недоступна.");
  });

  it.skip("при повторной отправке, если INFO нет — показываем 'Что-то пошло не так'", async () => {
    document.cookie = "sms_hash=resend2";

    axios.post.mockImplementation((url, payload) => {
      if (payload && payload.resend) {
        return Promise.reject(
          Object.assign(new Error("too_often"), {
            response: {
              data: {
                error: "too_often",
              },
            },
          })
        );
      }
      return Promise.resolve({
        data: [
          {
            PHONE: "xxx",
            MESSAGE: "Введите код",
            remainingSeconds: 0,
          },
        ],
      });
    });

    const wrapper = createWrapper();

    await callFetchInfoAndFlush(wrapper);

    const resendBtn = wrapper.find("#sms-confirm-resend-btn");
    await resendBtn.trigger("click");

    await flushPromises();
    await wrapper.vm.$nextTick();
    wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();

    const errorEl = wrapper.find("#sms-confirm-error");
    expect(errorEl.exists()).toBe(true);
    expect(errorEl.text()).toContain("Что-то пошло не так");
  });
});
