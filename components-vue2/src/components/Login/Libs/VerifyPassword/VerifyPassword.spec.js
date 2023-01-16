import { mount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import VerifyPassword from "./VerifyPassword.vue";
import Vuelidate from "vuelidate/lib/validators";

jest.mock(Vuelidate);

describe("VerifyPassword", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  const dataPassword = {
    phone: "",
    code: "",
    email: "",
    surname: "",
    name: "",
    patronymic: "",
    birthdate: "",
    password: "1Jonm!ppM",
    password2: "1Jonm!ppM",
  };

  it("Должен показать пароль только первого инпута при клике на первый глазик, при повторном клике по кнопке - пароль первого инпута скрывается", async () => {
    const wrapper = mount(VerifyPassword, {
      propsData: {
        validateState: jest.fn(),
        v: dataPassword,
      },
    });

    await wrapper.find("#btn_password_visible").trigger("click");

    expect(wrapper.find("#password1").attributes("type")).toContain("text");
    expect(wrapper.find("#password2").attributes("type")).toContain("password");

    await wrapper.find("#btn_password_visible").trigger("click");
    expect(wrapper.find("#password1").attributes("type")).toContain("password");
  });

  it("Должен показать пароль только второго инпута при клике на второй глазик, при повторном клике по кнопке - пароль второго инпута скрывается", async () => {
    const wrapper = mount(VerifyPassword, {
      propsData: {
        validateState: jest.fn(),
        v: dataPassword,
      },
    });
    await wrapper.find("#btn_password_visible2").trigger("click");
    expect(wrapper.find("#password1").attributes("type")).toContain("password");
    expect(wrapper.find("#password2").attributes("type")).toContain("text");

    await wrapper.find("#btn_password_visible2").trigger("click");
    expect(wrapper.find("#password2").attributes("type")).toContain("password");
  });

  it("Должны быть скрыты все пароли, если не было кликов по кнопкам", async () => {
    const wrapper = mount(VerifyPassword, {
      propsData: {
        validateState: jest.fn(),
        v: dataPassword,
      },
    });

    expect(wrapper.find("#password1").attributes("type")).toContain("password");
    expect(wrapper.find("#password2").attributes("type")).toContain("password");
  });
});
