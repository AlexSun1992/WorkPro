import { createLocalVue, mount } from "@vue/test-utils";

import { BootstrapVue, ModalPlugin } from "bootstrap-vue";

import axios from "axios";

import RegForm from "./RegForm.vue";

jest.mock("axios");

describe("RegForm", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("должен показывать ошибку", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, {
      localVue,
      mocks: {
        $LogEvent: (v) => v,
      },
    });

    axios.post.mockReturnValue({
      data: [
        {
          ERRORLIST: [
            {
              ERRORTEXT:
                "Что-то пошло не так. Наши разработчики уже разбираются с проблемой.",
            },
          ],
          ERRORCODE: 105,
          ERROR: "[Смотрите список ошибок.]",
        },
      ],
    });

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);

    expect(
      wrapper.find("#btn_code_verification_lk").attributes().disabled
    ).toBeDefined();

    await wrapper.find("#phone").setValue("+7(910)-123-22-33");

    expect(
      wrapper.find("#btn_code_verification_lk").attributes().disabled
    ).toBeDefined();

    const surnameComponent = wrapper.findComponent({
      ref: "autocompleteSurname",
    });
    const surnameInput = surnameComponent.find("input");
    await surnameInput.setValue("П");
    expect(surnameComponent.classes()).toContain("is-valid");

    const patronymicComponent = wrapper.findComponent({
      ref: "autocompletePatronymic",
    });
    const patronymicInput = patronymicComponent.find("input");
    await patronymicInput.setValue("П");

    const nameComponent = wrapper.findComponent({
      ref: "autocompleteName",
    });
    const nameInput = nameComponent.find("input");
    await nameInput.setValue("П");

    const checkboxComponent = wrapper.findComponent("#check-box");

    await checkboxComponent.setChecked(true);

    expect(patronymicInput.attributes().disabled).toBeDefined();

    const dataPickerInput = wrapper
      .findComponent("#birthday-picker")
      .find("input");

    dataPickerInput.setValue("21.12.2052");
    dataPickerInput.trigger("change");
    await wrapper.findComponent({ ref: "policyNumber" }).trigger("focus");
    expect(dataPickerInput.classes()).not.toContain("is-valid");

    dataPickerInput.setValue("21.12.1852");
    dataPickerInput.trigger("change");
    await wrapper.findComponent({ ref: "policyNumber" }).trigger("focus");
    expect(dataPickerInput.classes()).not.toContain("is-valid");

    dataPickerInput.setValue("21.12.2022");
    dataPickerInput.trigger("change");
    await wrapper.findComponent({ ref: "policyNumber" }).trigger("focus");
    expect(dataPickerInput.classes()).toContain("is-valid");

    await wrapper.find("#password1").setValue("12345");
    expect(wrapper.find("#password1").classes()).toContain("is-invalid");

    await wrapper.find("#password1").setValue("123456");
    expect(wrapper.find("#password1").classes()).toContain("is-valid");

    await wrapper.find("#password2").setValue("12345");
    expect(wrapper.find("#password2").classes()).toContain("is-invalid");

    await wrapper.find("#password2").setValue("123456");
    expect(wrapper.find("#password2").classes()).toContain("is-valid");

    expect(
      wrapper.find("#btn_code_verification_lk").attributes().disabled
    ).not.toBeDefined();

    await wrapper.find("#btn_code_verification_lk").trigger("click");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);
    expect(wrapper.find("#verify-error-message").exists()).toBe(true);
    expect(
      wrapper.find("#btn_code_verification_lk").attributes().disabled
    ).not.toBeDefined();
  });

  it("должен показать поле код подверждения", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, {
      localVue,
      mocks: {
        $LogEvent: (v) => v,
      },
    });
    axios.post.mockReturnValue({
      data: [
        {
          MESSAGE:
            "На Ваш номер телефона был отправлен код, который необходимо ввести ниже.",
          MESSAGE_CODE: 200,
        },
      ],
    });

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);

    await wrapper.find("#phone").setValue("+7(910)-123-22-33");

    expect(
      wrapper.find("#btn_code_verification_lk").attributes().disabled
    ).toBeDefined();

    const surnameComponent = wrapper.findComponent({
      ref: "autocompleteSurname",
    });
    const surnameInput = surnameComponent.find("input");
    await surnameInput.setValue("П");
    expect(surnameComponent.classes()).toContain("is-valid");

    const patronymicComponent = wrapper.findComponent({
      ref: "autocompletePatronymic",
    });
    const patronymicInput = patronymicComponent.find("input");
    await patronymicInput.setValue("П");

    const nameComponent = wrapper.findComponent({
      ref: "autocompleteName",
    });
    const nameInput = nameComponent.find("input");
    await nameInput.setValue("П");

    const checkboxComponent = wrapper.findComponent("#check-box");

    await checkboxComponent.setChecked(true);

    expect(patronymicInput.attributes().disabled).toBeDefined();

    const dataPickerInput = wrapper
      .findComponent("#birthday-picker")
      .find("input");

    dataPickerInput.setValue("21.12.2052");
    dataPickerInput.trigger("change");
    await wrapper.findComponent({ ref: "policyNumber" }).trigger("focus");
    expect(dataPickerInput.classes()).not.toContain("is-valid");

    dataPickerInput.setValue("21.12.1852");
    dataPickerInput.trigger("change");
    await wrapper.findComponent({ ref: "policyNumber" }).trigger("focus");
    expect(dataPickerInput.classes()).not.toContain("is-valid");

    dataPickerInput.setValue("21.12.2022");
    dataPickerInput.trigger("change");
    await wrapper.findComponent({ ref: "policyNumber" }).trigger("focus");
    expect(dataPickerInput.classes()).toContain("is-valid");

    await wrapper.find("#password1").setValue("12345");
    expect(wrapper.find("#password1").classes()).toContain("is-invalid");

    await wrapper.find("#password1").setValue("123456");
    expect(wrapper.find("#password1").classes()).toContain("is-valid");

    await wrapper.find("#password2").setValue("12345");
    expect(wrapper.find("#password2").classes()).toContain("is-invalid");

    await wrapper.find("#password2").setValue("123456");
    expect(wrapper.find("#password2").classes()).toContain("is-valid");

    expect(
      wrapper.find("#btn_code_verification_lk").attributes().disabled
    ).not.toBeDefined();

    await wrapper.find("#btn_code_verification_lk").trigger("click");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(true);
  });
  it("должен предупреждать если номер существует", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, {
      localVue,
      mocks: {
        $LogEvent: (v) => v,
      },
    });

    axios.post.mockReturnValue({
      data: [{ MESSAGE_CODE: 201 }],
    });

    const verifyUser = wrapper.findComponent({ ref: "verifyUser" });
    const spy = jest.spyOn(verifyUser.vm.$bvModal, "msgBoxConfirm");
    spy.mockImplementationOnce(() => Promise.resolve(true));

    Object.defineProperty(window, "location", {
      value: {
        href: "/",
        pathname: "/",
      },
    });

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);

    await wrapper.find("#phone").setValue("+7(910)-123-22-33");

    const surnameComponent = wrapper.findComponent({
      ref: "autocompleteSurname",
    });
    const surnameInput = surnameComponent.find("input");
    await surnameInput.setValue("П");
    expect(surnameComponent.classes()).toContain("is-valid");

    const patronymicComponent = wrapper.findComponent({
      ref: "autocompletePatronymic",
    });
    const patronymicInput = patronymicComponent.find("input");
    await patronymicInput.setValue("П");

    const nameComponent = wrapper.findComponent({
      ref: "autocompleteName",
    });
    const nameInput = nameComponent.find("input");
    await nameInput.setValue("П");

    const checkboxComponent = wrapper.findComponent("#check-box");

    await checkboxComponent.setChecked(true);

    expect(patronymicInput.attributes().disabled).toBeDefined();

    const dataPickerInput = wrapper
      .findComponent("#birthday-picker")
      .find("input");

    dataPickerInput.setValue("21.12.2052");
    dataPickerInput.trigger("change");
    await wrapper.findComponent({ ref: "policyNumber" }).trigger("focus");
    expect(dataPickerInput.classes()).not.toContain("is-valid");

    dataPickerInput.setValue("21.12.1852");
    dataPickerInput.trigger("change");
    await wrapper.findComponent({ ref: "policyNumber" }).trigger("focus");
    expect(dataPickerInput.classes()).not.toContain("is-valid");

    dataPickerInput.setValue("21.12.2022");
    dataPickerInput.trigger("change");
    await wrapper.findComponent({ ref: "policyNumber" }).trigger("focus");
    expect(dataPickerInput.classes()).toContain("is-valid");

    await wrapper.find("#password1").setValue("12345");
    expect(wrapper.find("#password1").classes()).toContain("is-invalid");

    await wrapper.find("#password1").setValue("123456");
    expect(wrapper.find("#password1").classes()).toContain("is-valid");

    await wrapper.find("#password2").setValue("12345");
    expect(wrapper.find("#password2").classes()).toContain("is-invalid");

    await wrapper.find("#password2").setValue("123456");
    expect(wrapper.find("#password2").classes()).toContain("is-valid");

    await wrapper.find("#btn_code_verification_lk").trigger("click");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);
    expect(spy).toHaveBeenCalled();
    expect(window.location.href).toEqual("/login/password-recovery");

    spy.mockImplementationOnce(() => Promise.resolve(false));

    await wrapper.find("#btn_code_verification_lk").trigger("click");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);

    expect(spy).toHaveBeenCalled();
    expect(window.location.href).toEqual("/login");

    spy.mockImplementationOnce(() => Promise.resolve(null));

    await wrapper.find("#btn_code_verification_lk").trigger("click");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);
    expect(spy).toHaveBeenCalled();
    expect(wrapper.find("#phone").element.value).toBe("");
  });
  it("должен отображать кнопку зарегистрироваться после ввода кода подверждения", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, {
      localVue,
      mocks: {
        $LogEvent: (v) => v,
      },
    });
    axios.post.mockReturnValue({
      data: [
        {
          MESSAGE:
            "На Ваш номер телефона был отправлен код, который необходимо ввести ниже.",
          MESSAGE_CODE: 200,
        },
      ],
    });

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);

    await wrapper.find("#phone").setValue("+7(910)-123-22-33");

    const surnameComponent = wrapper.findComponent({
      ref: "autocompleteSurname",
    });
    const surnameInput = surnameComponent.find("input");
    await surnameInput.setValue("П");
    expect(surnameComponent.classes()).toContain("is-valid");

    const patronymicComponent = wrapper.findComponent({
      ref: "autocompletePatronymic",
    });
    const patronymicInput = patronymicComponent.find("input");
    await patronymicInput.setValue("П");

    const nameComponent = wrapper.findComponent({
      ref: "autocompleteName",
    });
    const nameInput = nameComponent.find("input");
    await nameInput.setValue("П");

    const checkboxComponent = wrapper.findComponent("#check-box");

    await checkboxComponent.setChecked(true);

    expect(patronymicInput.attributes().disabled).toBeDefined();

    const dataPickerInput = wrapper
      .findComponent("#birthday-picker")
      .find("input");

    dataPickerInput.setValue("21.12.2052");
    dataPickerInput.trigger("change");
    await wrapper.findComponent({ ref: "policyNumber" }).trigger("focus");
    expect(dataPickerInput.classes()).not.toContain("is-valid");

    dataPickerInput.setValue("21.12.1852");
    dataPickerInput.trigger("change");
    await wrapper.findComponent({ ref: "policyNumber" }).trigger("focus");
    expect(dataPickerInput.classes()).not.toContain("is-valid");

    dataPickerInput.setValue("21.12.2022");
    dataPickerInput.trigger("change");
    await wrapper.findComponent({ ref: "policyNumber" }).trigger("focus");
    expect(dataPickerInput.classes()).toContain("is-valid");

    await wrapper.find("#password1").setValue("12345");
    expect(wrapper.find("#password1").classes()).toContain("is-invalid");

    await wrapper.find("#password1").setValue("123456");
    expect(wrapper.find("#password1").classes()).toContain("is-valid");

    await wrapper.find("#password2").setValue("12345");
    expect(wrapper.find("#password2").classes()).toContain("is-invalid");

    await wrapper.find("#password2").setValue("123456");
    expect(wrapper.find("#password2").classes()).toContain("is-valid");

    await wrapper.find("#btn_code_verification_lk").trigger("click");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    await wrapper.find("#sms-confirm").setValue("12345");
    expect(wrapper.findComponent("#btn_chek_registration_lk").exists()).toBe(
      true
    );
  });

  it("должен корректно заполнять форму", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, {
      localVue,
      attachTo: document.body,
      mocks: {
        $LogEvent: (v) => v,
      },
    });
    axios.post.mockReturnValue({
      data: [
        {
          MESSAGE:
            "На Ваш номер телефона был отправлен код, который необходимо ввести ниже.",
          MESSAGE_CODE: 200,
        },
      ],
    });

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);

    const surnameComponent = wrapper.findComponent({
      ref: "autocompleteSurname",
    });
    const surnameInput = surnameComponent.find("input");
    await surnameInput.setValue("П");
    expect(surnameComponent.classes()).toContain("is-valid");

    const patronymicComponent = wrapper.findComponent({
      ref: "autocompletePatronymic",
    });
    const patronymicInput = patronymicComponent.find("input");
    await patronymicInput.setValue("П");

    const nameComponent = wrapper.findComponent({
      ref: "autocompleteName",
    });
    const nameInput = nameComponent.find("input");
    await nameInput.setValue("П");

    const checkboxComponent = wrapper.findComponent("#check-box");

    await checkboxComponent.setChecked(true);

    expect(patronymicInput.attributes().disabled).toBeDefined();

    const dataPickerInput = wrapper
      .findComponent("#birthday-picker")
      .find("input");

    dataPickerInput.setValue("21.12.2052");
    dataPickerInput.trigger("change");
    await wrapper.findComponent({ ref: "policyNumber" }).trigger("focus");
    expect(dataPickerInput.classes()).not.toContain("is-valid");

    dataPickerInput.setValue("21.12.1852");
    dataPickerInput.trigger("change");
    await wrapper.findComponent({ ref: "policyNumber" }).trigger("focus");
    expect(dataPickerInput.classes()).not.toContain("is-valid");

    dataPickerInput.setValue("21.12.2022");
    dataPickerInput.trigger("change");
    await wrapper.findComponent({ ref: "policyNumber" }).trigger("focus");
    expect(dataPickerInput.classes()).toContain("is-valid");

    await wrapper.find("#password1").setValue("12345");
    expect(wrapper.find("#password1").classes()).toContain("is-invalid");

    await wrapper.find("#password1").setValue("123456");
    expect(wrapper.find("#password1").classes()).toContain("is-valid");

    await wrapper.find("#password2").setValue("12345");
    expect(wrapper.find("#password2").classes()).toContain("is-invalid");

    await wrapper.find("#password2").setValue("123456");
    expect(wrapper.find("#password2").classes()).toContain("is-valid");

    await wrapper.find("#phone").setValue("+7(910)-123-22-33");
    await wrapper.find("#btn_code_verification_lk").trigger("click");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(axios.post).toHaveBeenCalledWith(
      "/am/free/v2/sendsmscode",
      {
        PHONE: "+7(910)-123-22-33",
        error: false,
        loginType: "phone",
        modeType: "REG",
        token: 1,
      },
      { headers: { "X-Application": "VueJS", recaptcha: 1 } }
    );

    await wrapper.find("#sms-confirm").setValue("12345");

    axios.post.mockImplementationOnce(() => {
      const wrongAuthError = new Error("");
      wrongAuthError.response = {
        data: {
          MESSAGE:
            'ORA-20105: Неправильно введен код подтверждения или истек срок действия.\nORA-06512: на  "MOBILE.AMAUTH3", line 74\nORA-06512: на  "MOBILE.AMAUTH3", line 558\nORA-06512: на  line 1\n',
          STATUS: 500,
          REASON: "Internal Server Error",
          INFO: "Неправильно введен код подтверждения или истек срок действия.",
        },
      };
      throw wrongAuthError;
    });

    axios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: [{ MESSAGE: "Вы успешно зарегистрированы", MESSAGE_CODE: "200" }],
        status: 200,
      })
    );

    await wrapper.find("#btn_chek_registration_lk").trigger("click");
    expect(wrapper.find("#error-message").exists()).toBe(true);
    expect(wrapper.find("#error-message").text()).toContain(
      "Неправильно введен код подтверждения или истек срок действия."
    );

    const spy = jest.spyOn(wrapper.vm.$bvModal, "msgBoxOk");
    spy.mockImplementation(() => Promise.resolve());

    Object.defineProperty(window, "location", {
      value: {
        href: "/",
      },
    });

    await wrapper.find("#btn_chek_registration_lk").trigger("click");
    expect(wrapper.find("#error-message").exists()).toBe(false);
    expect(axios.post).toHaveBeenLastCalledWith(
      "/am/free/v2/registration",
      {
        BIRTHDATE: "2022-12-21",
        CODE: "12345",
        FIRSTNAME: "П",
        PASSWORD: "123456",
        PASSWORD_CONFIRM: "123456",
        PHONE: "+7(910)-123-22-33",
        POLICY_NUMBER: "",
        SECONDNAME: "П",
        THIRDNAME: "",
        THIRDNAMENOTEXISTS: "Y",
        USER_CONFIRM: "Y",
      },
      { headers: { "X-Application": "VueJS", recaptcha: undefined } }
    );
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(spy).toHaveBeenCalled();
    expect(window.location.href).toEqual("/login");
  });

  it("Необходимо валидировать отчество при 'загрязнении' поля", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, {
      localVue,
      attachTo: document.body,
      mocks: {
        $LogEvent: (v) => v,
      },
    });

    const patronymicComponent = wrapper.findComponent({
      ref: "autocompletePatronymic",
    });
    const patronymicInput = patronymicComponent.find("input");
    await patronymicInput.setValue("П");
    await patronymicInput.setValue("");
    expect(patronymicComponent.classes()).toContain("is-invalid");
  });

  it("При нажатии чекбокса 'нет отчества' убирает ошибку у поля отчества при неверной валидации", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, { localVue, attachTo: document.body });

    const patronymicComponent = wrapper.findComponent({
      ref: "autocompletePatronymic",
    });
    const patronymicInput = patronymicComponent.find("input");

    await patronymicInput.setValue("П");
    await patronymicInput.setValue("");

    await wrapper.find("#check-box").setChecked();

    expect(patronymicInput.attributes().disabled).toBe("disabled");
    expect(patronymicComponent.classes()).not.toContain("is-invalid");
  });
});
