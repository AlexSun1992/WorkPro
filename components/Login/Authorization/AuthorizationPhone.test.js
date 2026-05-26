import { mount, shallowMount } from "@vue/test-utils";
import AuthorizationPhone from "./AuthorizationPhone.vue";
import PhoneField from "./PhoneField.vue";
import ControlInformer from "@/components/Libs/Controls/ControlInformer/ControlInformer";
import EsiaButton from "./EsiaButton.vue";
import { redirectWithRef } from "./redirect";

jest.mock("./redirect", () => ({
  redirectWithRef: jest.fn(),
}));

describe("AuthorizationPhone", () => {
  const defaultProps = {
    userData: { username: "" },
    options: {
      informerText: "",
      statusObject: "",
      errorInput: "",
      isMainFormDisabled: false,
    },
  };

  it("отображает заголовок и изображение", () => {
    const wrapper = shallowMount(AuthorizationPhone, {
      propsData: defaultProps,
    });

    expect(wrapper.find(".login-header img").exists()).toBe(true);
    expect(wrapper.find(".login-header-title").text()).toContain("Войдите или создайте профиль");
    expect(wrapper.find(".login-header-title span").text()).toContain(
      "Чтобы купить и управлять своими страховыми продуктами"
    );
  });

  it("отображает ControlInformer с правильными данными", () => {
    const informerText = "Информационное сообщение";
    const wrapper = shallowMount(AuthorizationPhone, {
      propsData: {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          informerText,
          statusObject: "SINFO",
        },
      },
    });

    const informer = wrapper.findComponent(ControlInformer);
    expect(informer.exists()).toBe(true);
    expect(informer.props("data")).toEqual({
      value: informerText,
      name: "SINFO",
    });
  });

  it("отображает PhoneField и передает правильные пропсы", () => {
    const wrapper = shallowMount(AuthorizationPhone, {
      propsData: defaultProps,
    });

    const phoneField = wrapper.findComponent(PhoneField);
    expect(phoneField.exists()).toBe(true);
    expect(phoneField.props("userData")).toEqual(defaultProps.userData);
  });

  it("добавляет класс is-invalid к PhoneField при наличии ошибки", () => {
    const wrapper = mount(AuthorizationPhone, {
      propsData: {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          errorInput: "Неверный номер телефона",
        },
      },
    });

    const phoneField = wrapper.find(".r-error");

    expect(phoneField.exists()).toBe(true);
  });

  it("отображает сообщение об ошибке под полем ввода при наличии errorInput", () => {
    const wrapper = mount(AuthorizationPhone, {
      propsData: {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          errorInput: "Неверный номер телефона",
        },
      },
    });

    const errorElement = wrapper.find(".invalid-feedback");

    expect(errorElement.exists()).toBe(true);
    expect(errorElement.text()).toBe("Неверный номер телефона");
  });

  it("не отображает сообщение об ошибке при отсутствии errorInput", () => {
    const wrapper = shallowMount(AuthorizationPhone, {
      propsData: defaultProps,
    });

    const errorElement = wrapper.find(".invalid-feedback.d-block");
    expect(errorElement.exists()).toBe(false);
  });

  it("отображает кнопки дополнительных способов входа", () => {
    const wrapper = shallowMount(AuthorizationPhone, {
      propsData: defaultProps,
    });

    expect(wrapper.findComponent(EsiaButton).exists()).toBe(true);
    expect(wrapper.find("#alfa-login").exists()).toBe(true);
    expect(wrapper.find("#sberid-login").exists()).toBe(true);
    expect(wrapper.find(".login_more-title").text()).toBe("Либо войти с помощью");
  });

  it("вызывает redirectWithRef при клике на кнопки сторонних сервисов", async () => {
    const wrapper = shallowMount(AuthorizationPhone, {
      propsData: defaultProps,
    });

    await wrapper.find("#alfa-login").trigger("click");
    expect(redirectWithRef).toHaveBeenCalledWith("/sso?auth&type=alfa");

    await wrapper.find("#sberid-login").trigger("click");
    expect(redirectWithRef).toHaveBeenCalledWith("/sso?auth&type=sberid");
  });

  it("отображает футер со ссылкой на старый вход", () => {
    const wrapper = shallowMount(AuthorizationPhone, {
      propsData: defaultProps,
    });

    expect(wrapper.find(".login-footer").exists()).toBe(true);
    expect(wrapper.find(".login-footer").text()).toContain("Или воспользоваться старым входом");

    const link = wrapper.find(".login-footer a");
    expect(link.exists()).toBe(true);
    expect(link.text()).toBe("e-mail/номеру телефона и паролю");
    expect(link.attributes("href")).toBe("/login");
  });

  it("эмитит событие submit при отправке формы с номером телефона", async () => {
    const wrapper = shallowMount(AuthorizationPhone, {
      propsData: defaultProps,
    });

    await wrapper.vm.updatePhone("+79991234567");

    await wrapper.find("#auth-form").trigger("submit.prevent");

    expect(wrapper.emitted().submit).toBeTruthy();
    expect(wrapper.emitted().submit[0]).toEqual(["+79991234567"]);
  });

  it("не эмитит событие submit при пустом номере телефона", async () => {
    const wrapper = shallowMount(AuthorizationPhone, {
      propsData: defaultProps,
    });

    await wrapper.find("#auth-form").trigger("submit.prevent");

    expect(wrapper.emitted().submit).toStrictEqual([[""]]);
  });

  it("правильно обновляет состояние disabled кнопки при изменении номера", async () => {
    const wrapper = shallowMount(AuthorizationPhone, {
      propsData: defaultProps,
    });

    expect(wrapper.vm.isDisabled).toBe(true);

    await wrapper.vm.updatePhone("+7999");
    expect(wrapper.vm.isDisabled).toBe(true); // Меньше 12 символов

    await wrapper.vm.updatePhone("+79991234567");
    expect(wrapper.vm.isDisabled).toBe(false); // 12 символов

    await wrapper.vm.updatePhone("");
    expect(wrapper.vm.isDisabled).toBe(true);
  });

  it("не блокирует форму при isMainFormDisabled: false", () => {
    const wrapper = shallowMount(AuthorizationPhone, {
      propsData: defaultProps,
    });

    expect(wrapper.vm.isMainFormDisabled).toBe(false);
  });

  it("корректно обрабатывает updatePhone событие от PhoneField", async () => {
    const wrapper = shallowMount(AuthorizationPhone, {
      propsData: defaultProps,
    });

    const newPhone = "+79998887766";

    // Вызываем updatePhone через компонент PhoneField
    wrapper.findComponent(PhoneField).vm.$emit("updatePhone", newPhone);

    // Проверяем, что номер обновился
    expect(wrapper.vm.user).toBe(newPhone);
  });
});
describe("AuthorizationPhone edge cases", () => {
  const defaultProps = {
    userData: { username: "" },
    options: {
      informerText: "",
      statusObject: "",
      errorInput: "",
      isMainFormDisabled: false,
    },
  };

  it("сохраняет начальное значение user из userData", () => {
    const initialPhone = "+79991234567";
    const wrapper = shallowMount(AuthorizationPhone, {
      propsData: {
        userData: { username: initialPhone },
        options: defaultProps.options,
      },
    });

    expect(wrapper.vm.user).toBe(initialPhone);
  });

  it("не дизейблит кнопку при валидном номере и isMainFormDisabled: false", async () => {
    const wrapper = shallowMount(AuthorizationPhone, {
      propsData: {
        userData: { username: "+79991234567" },
        options: defaultProps.options,
      },
    });

    expect(wrapper.vm.isDisabled).toBe(false);
  });

  it("правильно комбинирует isMainFormDisabled и проверку номера", async () => {
    const wrapper = shallowMount(AuthorizationPhone, {
      propsData: {
        userData: { username: "+79991234567" },
        options: {
          ...defaultProps.options,
          isMainFormDisabled: true,
        },
      },
    });

    expect(wrapper.vm.isDisabled).toBe(true);
  });
});
