import { createLocalVue, mount } from "@vue/test-utils";

import { BootstrapVue } from "bootstrap-vue";

import axios from "axios";

import RegForm from "./RegForm.vue";
import { set } from "lodash";

jest.mock("axios");

jest.useFakeTimers();

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

    const checkboxComponent = wrapper.findComponent("#policy-exist-check-box");

    expect(
      wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled
    ).toBeDefined();

    await checkboxComponent.setChecked(true);

    expect(
      wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled
    ).not.toBeDefined();

    wrapper.findComponent({ ref: "policyNumber" }).setValue("12345");

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

    await wrapper.find("#password1").setValue("Aa1234");
    expect(wrapper.find("#password1").classes()).toContain("is-valid");

    await wrapper.find("#password2").setValue("12345");
    expect(wrapper.find("#password2").classes()).toContain("is-invalid");

    await wrapper.find("#password2").setValue("Aa1234");
    expect(wrapper.find("#password2").classes()).toContain("is-valid");

    await wrapper.find("#agreement-check-box").setChecked(true);

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
          MESSAGE: "Введите код подтверждения из SMS",
          MESSAGE_CODE: 200,
          GUID: "68A6B6024E3C03B39C9BFDC78D5E235B",
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

    const checkboxComponent = wrapper.findComponent("#policy-exist-check-box");

    expect(
      wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled
    ).toBeDefined();

    await checkboxComponent.setChecked(true);

    expect(
      wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled
    ).not.toBeDefined();

    wrapper.findComponent({ ref: "policyNumber" }).setValue("12345");

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

    await wrapper.find("#password1").setValue("Aa1234");
    expect(wrapper.find("#password1").classes()).toContain("is-valid");

    await wrapper.find("#password2").setValue("12345");
    expect(wrapper.find("#password2").classes()).toContain("is-invalid");

    await wrapper.find("#password2").setValue("Aa1234");
    expect(wrapper.find("#password2").classes()).toContain("is-valid");

    await wrapper.find("#agreement-check-box").setChecked(true);

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

    const checkboxComponent = wrapper.findComponent("#policy-exist-check-box");

    expect(
      wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled
    ).toBeDefined();

    await checkboxComponent.setChecked(true);

    expect(
      wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled
    ).not.toBeDefined();

    wrapper.findComponent({ ref: "policyNumber" }).setValue("12345");

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

    await wrapper.find("#password1").setValue("Aa1234");
    expect(wrapper.find("#password1").classes()).toContain("is-valid");

    await wrapper.find("#password2").setValue("12345");
    expect(wrapper.find("#password2").classes()).toContain("is-invalid");

    await wrapper.find("#password2").setValue("Aa1234");
    expect(wrapper.find("#password2").classes()).toContain("is-valid");

    await wrapper.find("#agreement-check-box").setChecked(true);

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
  it("доступность кнопок", async () => {
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
          MESSAGE: "Введите код подтверждения из SMS",
          MESSAGE_CODE: 200,
          GUID: "68A6B6024E3C03B39C9BFDC78D5E235B",
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

    const checkboxComponent = wrapper.findComponent("#policy-exist-check-box");

    expect(
      wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled
    ).toBeDefined();

    await checkboxComponent.setChecked(true);

    expect(
      wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled
    ).not.toBeDefined();

    wrapper.findComponent({ ref: "policyNumber" }).setValue("");

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

    await wrapper.find("#password1").setValue("Aa1234");
    expect(wrapper.find("#password1").classes()).toContain("is-valid");

    await wrapper.find("#password2").setValue("12345");
    expect(wrapper.find("#password2").classes()).toContain("is-invalid");

    await wrapper.find("#password2").setValue("Aa1234");
    expect(wrapper.find("#password2").classes()).toContain("is-valid");

    expect(
      wrapper.findComponent("#btn_code_verification_lk").attributes().disabled
    ).toBeDefined();

    await wrapper.find("#agreement-check-box").setChecked(true);

    expect(
      wrapper.findComponent("#btn_code_verification_lk").attributes().disabled
    ).toBeDefined();

    wrapper.findComponent({ ref: "policyNumber" }).setValue("12345");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(
      wrapper.findComponent("#btn_code_verification_lk").attributes().disabled
    ).not.toBeDefined();

    wrapper.findComponent({ ref: "policyNumber" }).setValue("");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(
      wrapper.findComponent("#btn_code_verification_lk").attributes().disabled
    ).toBeDefined();

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);

    await checkboxComponent.setChecked(false);

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(
      wrapper.findComponent("#btn_code_verification_lk").attributes().disabled
    ).not.toBeDefined();

    expect(
      wrapper.findComponent("#btn_change_data_registration_lk").attributes()
        .disabled
    ).toBeDefined();

    expect(wrapper.find("#verify-success-message").exists()).toBe(false);

    await wrapper.find("#btn_code_verification_lk").trigger("click");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.find("#verify-success-message").exists()).toBe(true);

    expect(
      wrapper.findComponent("#btn_change_data_registration_lk").attributes()
        .disabled
    ).not.toBeDefined();

    expect(
      wrapper.findComponent("#btn_chek_registration_lk").attributes().disabled
    ).toBeDefined();

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(true);

    await wrapper.find("#sms-confirm").setValue("12345");

    expect(
      wrapper.findComponent("#btn_chek_registration_lk").attributes().disabled
    ).not.toBeDefined();

    expect(
      wrapper.findComponent("#btn_code_verification_lk").attributes().disabled
    ).toBeDefined();

    jest.advanceTimersByTime(61000);

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(
      wrapper.findComponent("#btn_change_data_registration_lk").attributes()
        .disabled
    ).not.toBeDefined();

    expect(
      wrapper.findComponent("#btn_code_verification_lk").attributes().disabled
    ).not.toBeDefined();

    expect(
      wrapper.findComponent("#btn_change_data_registration_lk").attributes()
        .disabled
    ).not.toBeDefined();

    await wrapper.find("#btn_change_data_registration_lk").trigger("click");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.find("#verify-success-message").exists()).toBe(false);

    expect(
      wrapper.findComponent("#btn_change_data_registration_lk").attributes()
        .disabled
    ).toBeDefined();

    expect(
      wrapper.findComponent("#btn_chek_registration_lk").attributes().disabled
    ).toBeDefined();

    expect(
      wrapper.findComponent("#btn_code_verification_lk").attributes().disabled
    ).not.toBeDefined();
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
          MESSAGE: "Введите код подтверждения из SMS",
          MESSAGE_CODE: 200,
          GUID: "68A6B6024E3C03B39C9BFDC78D5E235B",
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

    const checkboxComponent = wrapper.findComponent("#policy-exist-check-box");

    expect(
      wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled
    ).toBeDefined();

    await checkboxComponent.setChecked(true);

    expect(
      wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled
    ).not.toBeDefined();

    wrapper.findComponent({ ref: "policyNumber" }).setValue("123");

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

    await wrapper.find("#password1").setValue("Aa1234");
    expect(wrapper.find("#password1").classes()).toContain("is-valid");

    await wrapper.find("#password2").setValue("12345");
    expect(wrapper.find("#password2").classes()).toContain("is-invalid");

    await wrapper.find("#password2").setValue("Aa1234");
    expect(wrapper.find("#password2").classes()).toContain("is-valid");

    await wrapper.find("#agreement-check-box").setChecked(true);

    await wrapper.find("#phone").setValue("+7(910)-123-22-33");
    await wrapper.find("#btn_code_verification_lk").trigger("click");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(axios.post).toHaveBeenCalledWith(
      "/am/free/v2/registerUser1",
      {
        BIRTHDATE: "2022-12-21",
        FIRSTNAME: "П",
        GUID: null,
        PASSWORD: "Aa1234",
        PASSWORD_CONFIRM: "Aa1234",
        PHONE: "+7(910)-123-22-33",
        POLICY_NUMBER: "123",
        SECONDNAME: "П",
        THIRDNAME: "П",
        USER_CONFIRM: "Y",
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
        data: [{ MESSAGE: "Вы успешно зарегистрированы", MESSAGE_CODE: 200 }],
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
      "/am/free/v2/registerUser2",
      {
        BIRTHDATE: "2022-12-21",
        CODE: "12345",
        FIRSTNAME: "П",
        PASSWORD: "Aa1234",
        PASSWORD_CONFIRM: "Aa1234",
        PHONE: "+7(910)-123-22-33",
        POLICY_NUMBER: "123",
        SECONDNAME: "П",
        THIRDNAME: "П",
        USER_CONFIRM: "Y",
        GUID: "68A6B6024E3C03B39C9BFDC78D5E235B",
      },
      { headers: { "X-Application": "VueJS", recaptcha: undefined } }
    );
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(spy).toHaveBeenCalled();
    expect(window.location.href).toEqual("/login");
  });

  it("При нажатии чекбокса 'У меня есть полис РЕСО' убирает ошибку у поля номер полиса при неверной валидации", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, { localVue, attachTo: document.body });

    expect(
      wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled
    ).toBeDefined();

    const checkboxComponent = wrapper.findComponent("#policy-exist-check-box");

    await checkboxComponent.setChecked(true);

    expect(
      wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled
    ).not.toBeDefined();

    wrapper.findComponent({ ref: "policyNumber" }).setValue("123");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent({ ref: "policyNumber" }).classes()).toContain(
      "is-valid"
    );

    wrapper.findComponent({ ref: "policyNumber" }).setValue("");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent({ ref: "policyNumber" }).classes()).toContain(
      "is-invalid"
    );

    await checkboxComponent.setChecked(false);

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(
      wrapper.findComponent({ ref: "policyNumber" }).classes()
    ).not.toContain("is-invalid");
  });
  ///

  it("Проверяем возможность введения пробела в поле Фамилии в качестве непервого символа", () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, { localVue, attachTo: document.body });
    const getRegFamilySelector = "[data-testid=regFamily]";
    const surenameInput = wrapper.find(getRegFamilySelector);
    surenameInput.setValue("Гаврило   в");
    expect(surenameInput.element.value.length).toBe(11);
  });

  ///
  it("Проверяем возможность введения пробела в поле Имя в качестве непервого символа", () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, { localVue, attachTo: document.body });
    const getRegFamilySelector = "[data-testid=regName]";
    const surenameInput = wrapper.find(getRegFamilySelector);
    surenameInput.setValue("Алекс   ей");
    expect(surenameInput.element.value.length).toBe(10);
  });

  ///
  it("Проверяем возможность введения пробела в поле Отчество в качестве непервого символа", () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, { localVue, attachTo: document.body });
    const getRegFamilySelector = "[data-testid=regPatronymic]";
    const surenameInput = wrapper.find(getRegFamilySelector);
    surenameInput.setValue("Никола   евич");
    expect(surenameInput.element.value.length).toBe(13);
  });
  ///

  it("Проверяем возможность введения пробела в поле Отчество в качестве непервого символа", () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, { localVue, attachTo: document.body });
    const getRegFamilySelector = "[data-testid=regFamily]";
    const surenameInput = wrapper.find(getRegFamilySelector);
    surenameInput.trigger("keydown", {
      key: "space",
    });
    expect(surenameInput.element.value.length).toBe(0);
  });

  ///
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
          MESSAGE: "Введите код подтверждения из SMS",
          MESSAGE_CODE: 200,
          GUID: "68A6B6024E3C03B39C9BFDC78D5E235B",
        },
      ],
    });

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);

    const surnameComponent = wrapper.findComponent({
      ref: "autocompleteSurname",
    });
    const surnameInput = surnameComponent.find("input");
    await surnameInput.setValue("П   ");
    expect(surnameComponent.classes()).toContain("is-valid");

    const patronymicComponent = wrapper.findComponent({
      ref: "autocompletePatronymic",
    });
    const patronymicInput = patronymicComponent.find("input");
    await patronymicInput.setValue("П   ");

    const nameComponent = wrapper.findComponent({
      ref: "autocompleteName",
    });
    const nameInput = nameComponent.find("input");
    await nameInput.setValue("П   ");

    const checkboxComponent = wrapper.findComponent("#policy-exist-check-box");

    expect(
      wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled
    ).toBeDefined();

    await checkboxComponent.setChecked(true);

    expect(
      wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled
    ).not.toBeDefined();

    wrapper.findComponent({ ref: "policyNumber" }).setValue("123");

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

    await wrapper.find("#password1").setValue("Aa1234");
    expect(wrapper.find("#password1").classes()).toContain("is-valid");

    await wrapper.find("#password2").setValue("12345");
    expect(wrapper.find("#password2").classes()).toContain("is-invalid");

    await wrapper.find("#password2").setValue("Aa1234");
    expect(wrapper.find("#password2").classes()).toContain("is-valid");

    await wrapper.find("#agreement-check-box").setChecked(true);

    await wrapper.find("#phone").setValue("+7(910)-123-22-33");
    await wrapper.find("#btn_code_verification_lk").trigger("click");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(axios.post).toHaveBeenCalledWith(
      "/am/free/v2/registerUser1",
      {
        BIRTHDATE: "2022-12-21",
        FIRSTNAME: "П",
        GUID: null,
        PASSWORD: "Aa1234",
        PASSWORD_CONFIRM: "Aa1234",
        PHONE: "+7(910)-123-22-33",
        POLICY_NUMBER: "123",
        SECONDNAME: "П",
        THIRDNAME: "П",
        USER_CONFIRM: "Y",
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
        data: [{ MESSAGE: "Вы успешно зарегистрированы", MESSAGE_CODE: 200 }],
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
      "/am/free/v2/registerUser2",
      {
        BIRTHDATE: "2022-12-21",
        CODE: "12345",
        FIRSTNAME: "П",
        PASSWORD: "Aa1234",
        PASSWORD_CONFIRM: "Aa1234",
        PHONE: "+7(910)-123-22-33",
        POLICY_NUMBER: "123",
        SECONDNAME: "П",
        THIRDNAME: "П",
        USER_CONFIRM: "Y",
        GUID: "68A6B6024E3C03B39C9BFDC78D5E235B",
      },
      { headers: { "X-Application": "VueJS", recaptcha: undefined } }
    );
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(spy).toHaveBeenCalled();
    expect(window.location.href).toEqual("/login");
  });

  ///
  it.only("Проверяем наличие всплывающего окна при регистрации", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, {
      localVue,
      mocks: {
        $LogEvent: (v) => v,
      },
    });

    const surnameComponent = wrapper.findComponent({
      ref: "autocompleteSurname",
    });
    const surnameInput = surnameComponent.find("input");
    await surnameInput.setValue("Казимиров");
    //
    const patronymicComponent = wrapper.findComponent({
      ref: "autocompletePatronymic",
    });
    const patronymicInput = patronymicComponent.find("input");
    await patronymicInput.setValue("Александрович");
    //
    const nameComponent = wrapper.findComponent({
      ref: "autocompleteName",
    });
    const nameInput = nameComponent.find("input");
    await nameInput.setValue("Андрей");

    const dataPickerInput = wrapper
      .findComponent("#birthday-picker")
      .find("input");

    dataPickerInput.setValue("27.06.1989");
    dataPickerInput.trigger("change");

    await wrapper.find("#password1").setValue("Carter911");
    await wrapper.find("#password2").setValue("Carter911");
    await wrapper.find("#phone").setValue("+7(985)-686-81-48");
    await wrapper.find("#agreement-check-box").setChecked(true);
    await wrapper.find("#btn_code_verification_lk").trigger("click");

    expect(axios.post).toHaveBeenLastCalledWith(
      "/am/free/v2/registerUser1",
      {
        BIRTHDATE: "1989-06-27",
        FIRSTNAME: "Андрей",
        GUID: null,
        PASSWORD: "Carter911",
        PASSWORD_CONFIRM: "Carter911",
        PHONE: "+7(985)-686-81-48",
        POLICY_NUMBER: "",
        SECONDNAME: "Казимиров",
        THIRDNAME: "Александрович",
        USER_CONFIRM: "Y",
        error: false,
        loginType: "phone",
        modeType: "REG",
        token: 1,
      },
      { headers: { "X-Application": "VueJS", recaptcha: 1 } }
    );

    // console.log("wrapper:", wrapper.html());

    // axios.post.mockReturnValue({
    //   data: [
    //     {
    //       MESSAGE:
    //         "Сейчас поступит входящий звонок. Прослушайте голосовое сообщение, введите код и нажмите на кнопку «Зарегистироваться»",
    //       MESSAGE_CODE: 200,
    //       GUID: "FBF58CA582F2078258408244C178422B",
    //     },
    //   ],
    // });

    axios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: [
          {
            MESSAGE:
              "Сейчас поступит входящий звонок. Прослушайте голосовое сообщение, введите код и нажмите на кнопку «Зарегистироваться»",
            MESSAGE_CODE: 200,
            GUID: "FBF58CA582F2078258408244C178422B",
          },
        ],
        status: 200,
      })
    );

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    await wrapper.find("#sms-confirm").setValue("11111");

    // console.log("wrapper:", wrapper.html());

    // axios.post.mockReturnValue({
    //   data: [{ MESSAGE_CODE: 201 }],
    // });

    // await wrapper.vm.$nextTick();
    // await wrapper.vm.$nextTick();

    // const verifyUser = wrapper.findComponent({ ref: "verifyUser" });
    // const spy = jest.spyOn(verifyUser.vm.$bvModal, "msgBoxConfirm");
    // spy.mockImplementationOnce(() => Promise.resolve(true));

    // Object.defineProperty(window, "location", {
    //   value: {
    //     href: "/",
    //     pathname: "/",
    //   },
    // });

    ///

    // expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);

    // ;

    // expect(surnameComponent.classes()).toContain("is-valid");

    // const checkboxComponent = wrapper.findComponent("#policy-exist-check-box");

    // expect(
    //   wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled
    // ).toBeDefined();

    // await checkboxComponent.setChecked(true);

    // expect(
    //   wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled
    // ).not.toBeDefined();

    // wrapper.findComponent({ ref: "policyNumber" }).setValue("12345");

    // dataPickerInput.setValue("21.12.2052");
    // dataPickerInput.trigger("change");
    // await wrapper.findComponent({ ref: "policyNumber" }).trigger("focus");
    // expect(dataPickerInput.classes()).not.toContain("is-valid");

    // dataPickerInput.setValue("21.12.1852");
    // dataPickerInput.trigger("change");
    // await wrapper.findComponent({ ref: "policyNumber" }).trigger("focus");
    // expect(dataPickerInput.classes()).not.toContain("is-valid");

    // dataPickerInput.setValue("21.12.2022");
    // dataPickerInput.trigger("change");
    // await wrapper.findComponent({ ref: "policyNumber" }).trigger("focus");
    // expect(dataPickerInput.classes()).toContain("is-valid");

    //

    // await wrapper.find("#btn_code_verification_lk").trigger("click");

    // await wrapper.vm.$nextTick();
    // await wrapper.vm.$nextTick();

    // expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);
    // expect(spy).toHaveBeenCalled();
    // expect(window.location.href).toEqual("/login/password-recovery");

    // spy.mockImplementationOnce(() => Promise.resolve(false));

    //

    // await wrapper.vm.$nextTick();
    // await wrapper.vm.$nextTick();

    // expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);

    // expect(spy).toHaveBeenCalled();
    // expect(window.location.href).toEqual("/login");

    // spy.mockImplementationOnce(() => Promise.resolve(null));

    // await wrapper.find("#btn_code_verification_lk").trigger("click");

    // await wrapper.vm.$nextTick();
    // await wrapper.vm.$nextTick();

    // expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);
    // expect(spy).toHaveBeenCalled();
    // expect(wrapper.find("#phone").element.value).toBe("");
  });
});
