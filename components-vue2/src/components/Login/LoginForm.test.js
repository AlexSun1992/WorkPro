import { mount } from "@vue/test-utils";
import axios from "axios";

import LoginForm from "./LoginForm.vue";

jest.mock("axios");
jest.mock("this.$bvModal");

describe("LoginForm", () => {
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
    await wrapper.find("form").trigger("submit.prevent");

    expect(wrapper.text()).toContain("Неверный логин или пароль");
  });

  it("должен показать капчу", async () => {
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
    axios.get.mockImplementationOnce(() => ({
      CAPTCHA: "data:image/png;base64",
      ID: 943824,
    }));

    await wrapper.find("#phone").setValue("ege@mmd.ru");
    await wrapper.find("#password").setValue("182821");
    await wrapper.find("form").trigger("submit.prevent");

    expect(wrapper.text()).toContain("Заполните капчу");
  });
  //
  it("не должен выводить ошибку логина + пароля", async () => {
    const wrapper = mount(LoginForm);
    axios.post.mockImplementationOnce(() => {
      const wrongAuthError = new Error("");
      wrongAuthError.response = {
        data: {
          MESSAGE: "Введите код подтверждения из SMS.",
          STATUS: 401,
          CODE: 104,
          NEEDCODE: true,
          SMSPHONE: "+7 (ХХХ) ХХХ-44-18",
          CODENAME: "PhoneCodeRequest",
          AUTHCODE: 2,
        },
      };
      throw wrongAuthError;
    });

    await wrapper.find("#phone").setValue("ege@mmd.ru");
    await wrapper.find("#password").setValue("182821");
    await wrapper.find("form").trigger("submit.prevent");

    expect(wrapper.text()).toContain("Неверный логин или пароль");
  });
});
