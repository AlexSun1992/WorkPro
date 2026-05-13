import { createLocalVue, mount } from "@vue/test-utils";

import { BootstrapVue } from "bootstrap-vue";

import axios from "axios";

import ControlDadataSelect from "@/components/Libs/Controls/ControlDadataSelect";
import RegForm from "./RegForm.vue";
import ControlDropdownBase from "@/components/Libs/Controls/ControlDropdownBase";

jest.mock("axios");

jest.useFakeTimers();

async function openDropdown(wrapper) {
  const dropdown = wrapper.findComponent(ControlDropdownBase);
  dropdown.vm.$emit("click-trigger", { target: wrapper.element });
  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();
}

async function closeDropdown(wrapper) {
  document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  await wrapper.vm.$nextTick();
}

async function typeSearch(wrapper, value) {
  const input = wrapper.find("input.combobox-search-input");
  expect(input.exists()).toBe(true);

  await input.setValue(value);
  await input.trigger("input");
}

describe.skip("RegForm", () => {
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
      components: {
        ControlDadataSelect,
        ControlDropdownBase,
      },
    });

    axios.post.mockReturnValue({
      data: [
        {
          ERRORLIST: [
            {
              ERRORTEXT: "Что-то пошло не так. Наши разработчики уже разбираются с проблемой.",
            },
          ],
          ERRORCODE: 105,
          ERROR: "[Смотрите список ошибок.]",
        },
      ],
    });

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);

    expect(wrapper.find("#btn_code_verification_lk").attributes().disabled).toBeDefined();

    await wrapper.find("#phone").setValue("+7(910)-123-22-33");

    expect(wrapper.find("#btn_code_verification_lk").attributes().disabled).toBeDefined();

    const surnameComponent = wrapper.findComponent({
      ref: "surnameComponent",
    });

    const surnameDropdown = surnameComponent.findComponent(ControlDropdownBase);

    await openDropdown(surnameDropdown);
    await typeSearch(surnameComponent, "П");
    await closeDropdown(surnameComponent);

    await wrapper.vm.$nextTick();

    expect(surnameDropdown.classes()).toContain("is-valid");

    const patronymicComponent = wrapper.findComponent({
      ref: "patronymicComponent",
    });

    const patronymicDropdown = patronymicComponent.findComponent(ControlDropdownBase);

    await openDropdown(patronymicDropdown);
    await typeSearch(patronymicComponent, "П");
    await closeDropdown(patronymicComponent);

    await wrapper.vm.$nextTick();

    expect(patronymicDropdown.classes()).toContain("is-valid");

    const nameComponent = wrapper.findComponent({
      ref: "nameComponent",
    });

    const nameDropdown = nameComponent.findComponent(ControlDropdownBase);

    await openDropdown(nameDropdown);
    await typeSearch(nameComponent, "П");
    await closeDropdown(nameComponent);

    await wrapper.vm.$nextTick();

    expect(nameDropdown.classes()).toContain("is-valid");

    const checkboxComponent = wrapper.findComponent("#policy-exist-check-box");

    expect(wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled).toBeDefined();

    await checkboxComponent.setChecked(true);

    expect(wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled).not.toBeDefined();

    wrapper.findComponent({ ref: "policyNumber" }).setValue("12345");

    const dataPickerInput = wrapper.findComponent("#birthday-picker").find("input");

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

    await wrapper.find("#password1").setValue("Aa1234rl");
    expect(wrapper.find("#password1").classes()).toContain("is-valid");

    await wrapper.find("#password2").setValue("12345");
    expect(wrapper.find("#password2").classes()).toContain("is-invalid");

    await wrapper.find("#password2").setValue("Aa1234rl");
    expect(wrapper.find("#password2").classes()).toContain("is-valid");

    await wrapper.find("#agreement-check-box").setChecked(true);
    await wrapper.find("#agreement-check-box_rec").setChecked(true);

    expect(wrapper.find("#btn_code_verification_lk").attributes().disabled).not.toBeDefined();

    await wrapper.find("#btn_code_verification_lk").trigger("click");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);
    expect(wrapper.find("#verify-error-message").exists()).toBe(true);
    // TODO скорее всего работате неправильно, так как captcha сейчас работает через callback а не асинхронно
    // expect(wrapper.find("#btn_code_verification_lk").attributes().disabled).not.toBeDefined();
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
          MESSAGE: "Введите код подтверждения из СМС",
          MESSAGE_CODE: 200,
          GUID: "68A6B6024E3C03B39C9BFDC78D5E235B",
        },
      ],
    });

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);

    await wrapper.find("#phone").setValue("+7(910)-123-22-33");

    expect(wrapper.find("#btn_code_verification_lk").attributes().disabled).toBeDefined();

    const surnameComponent = wrapper.findComponent({
      ref: "surnameComponent",
    });

    const surnameDropdown = surnameComponent.findComponent(ControlDropdownBase);

    await openDropdown(surnameDropdown);
    await typeSearch(surnameComponent, "П");
    await closeDropdown(surnameComponent);

    await wrapper.vm.$nextTick();

    expect(surnameDropdown.classes()).toContain("is-valid");

    const patronymicComponent = wrapper.findComponent({
      ref: "patronymicComponent",
    });

    const patronymicDropdown = patronymicComponent.findComponent(ControlDropdownBase);

    await openDropdown(patronymicDropdown);
    await typeSearch(patronymicComponent, "П");
    await closeDropdown(patronymicComponent);

    await wrapper.vm.$nextTick();

    expect(patronymicDropdown.classes()).toContain("is-valid");

    const nameComponent = wrapper.findComponent({
      ref: "nameComponent",
    });

    const nameDropdown = nameComponent.findComponent(ControlDropdownBase);

    await openDropdown(nameDropdown);
    await typeSearch(nameComponent, "П");
    await closeDropdown(nameComponent);

    await wrapper.vm.$nextTick();

    expect(nameDropdown.classes()).toContain("is-valid");

    const checkboxComponent = wrapper.findComponent("#policy-exist-check-box");

    expect(wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled).toBeDefined();

    await checkboxComponent.setChecked(true);

    expect(wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled).not.toBeDefined();

    wrapper.findComponent({ ref: "policyNumber" }).setValue("12345");

    const dataPickerInput = wrapper.findComponent("#birthday-picker").find("input");

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

    await wrapper.find("#password1").setValue("Aa1234!4");
    expect(wrapper.find("#password1").classes()).toContain("is-valid");

    await wrapper.find("#password2").setValue("12345");
    expect(wrapper.find("#password2").classes()).toContain("is-invalid");

    await wrapper.find("#password2").setValue("Aa1234!4");
    expect(wrapper.find("#password2").classes()).toContain("is-valid");

    await wrapper.find("#agreement-check-box").setChecked(true);
    await wrapper.find("#agreement-check-box_rec").setChecked(true);

    expect(wrapper.find("#btn_code_verification_lk").attributes().disabled).not.toBeDefined();

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
      ref: "surnameComponent",
    });

    const surnameDropdown = surnameComponent.findComponent(ControlDropdownBase);

    await openDropdown(surnameDropdown);
    await typeSearch(surnameComponent, "П");
    await closeDropdown(surnameComponent);

    await wrapper.vm.$nextTick();

    expect(surnameDropdown.classes()).toContain("is-valid");

    const patronymicComponent = wrapper.findComponent({
      ref: "patronymicComponent",
    });

    const patronymicDropdown = patronymicComponent.findComponent(ControlDropdownBase);

    await openDropdown(patronymicDropdown);
    await typeSearch(patronymicComponent, "П");
    await closeDropdown(patronymicComponent);

    await wrapper.vm.$nextTick();

    expect(patronymicDropdown.classes()).toContain("is-valid");

    const nameComponent = wrapper.findComponent({
      ref: "nameComponent",
    });

    const nameDropdown = nameComponent.findComponent(ControlDropdownBase);

    await openDropdown(nameDropdown);
    await typeSearch(nameComponent, "П");
    await closeDropdown(nameComponent);

    await wrapper.vm.$nextTick();

    expect(nameDropdown.classes()).toContain("is-valid");

    const checkboxComponent = wrapper.findComponent("#policy-exist-check-box");

    expect(wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled).toBeDefined();

    await checkboxComponent.setChecked(true);

    expect(wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled).not.toBeDefined();

    wrapper.findComponent({ ref: "policyNumber" }).setValue("12345");

    const dataPickerInput = wrapper.findComponent("#birthday-picker").find("input");

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

    await wrapper.find("#password1").setValue("Aa123478");
    expect(wrapper.find("#password1").classes()).toContain("is-valid");

    await wrapper.find("#password2").setValue("12345");
    expect(wrapper.find("#password2").classes()).toContain("is-invalid");

    await wrapper.find("#password2").setValue("Aa123478");
    expect(wrapper.find("#password2").classes()).toContain("is-valid");

    await wrapper.find("#agreement-check-box").setChecked(true);
    await wrapper.find("#agreement-check-box_rec").setChecked(true);

    await wrapper.find("#btn_code_verification_lk").trigger("click");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);
    expect(spy).toHaveBeenCalled();
    expect(window.location.href).toEqual("/login");

    spy.mockImplementationOnce(() => Promise.resolve(false));

    await wrapper.find("#btn_code_verification_lk").trigger("click");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);

    expect(spy).toHaveBeenCalled();
    expect(window.location.href).toEqual("/login/password-recovery");

    spy.mockImplementationOnce(() => Promise.resolve(null));

    await wrapper.find("#btn_code_verification_lk").trigger("click");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);
    expect(spy).toHaveBeenCalled();
    expect(wrapper.find("#phone").element.value).toBe("+7(910)-123-22-33");
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
          MESSAGE: "Введите код подтверждения из СМС",
          MESSAGE_CODE: 200,
          GUID: "68A6B6024E3C03B39C9BFDC78D5E235B",
        },
      ],
    });

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);

    await wrapper.find("#phone").setValue("+7(910)-123-22-33");

    const surnameComponent = wrapper.findComponent({
      ref: "surnameComponent",
    });

    const surnameDropdown = surnameComponent.findComponent(ControlDropdownBase);

    await openDropdown(surnameDropdown);
    await typeSearch(surnameComponent, "П");
    await closeDropdown(surnameComponent);

    await wrapper.vm.$nextTick();

    expect(surnameDropdown.classes()).toContain("is-valid");

    const patronymicComponent = wrapper.findComponent({
      ref: "patronymicComponent",
    });

    const patronymicDropdown = patronymicComponent.findComponent(ControlDropdownBase);

    await openDropdown(patronymicDropdown);
    await typeSearch(patronymicComponent, "П");
    await closeDropdown(patronymicComponent);

    await wrapper.vm.$nextTick();

    expect(patronymicDropdown.classes()).toContain("is-valid");

    const nameComponent = wrapper.findComponent({
      ref: "nameComponent",
    });

    const nameDropdown = nameComponent.findComponent(ControlDropdownBase);

    await openDropdown(nameDropdown);
    await typeSearch(nameComponent, "П");
    await closeDropdown(nameComponent);

    await wrapper.vm.$nextTick();

    expect(nameDropdown.classes()).toContain("is-valid");

    const checkboxComponent = wrapper.findComponent("#policy-exist-check-box");

    expect(wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled).toBeDefined();

    await checkboxComponent.setChecked(true);

    expect(wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled).not.toBeDefined();

    wrapper.findComponent({ ref: "policyNumber" }).setValue("");

    const dataPickerInput = wrapper.findComponent("#birthday-picker").find("input");

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

    await wrapper.find("#password1").setValue("Aa123438");
    expect(wrapper.find("#password1").classes()).toContain("is-valid");

    await wrapper.find("#password2").setValue("12345");
    expect(wrapper.find("#password2").classes()).toContain("is-invalid");

    await wrapper.find("#password2").setValue("Aa123438");
    expect(wrapper.find("#password2").classes()).toContain("is-valid");

    expect(wrapper.findComponent("#btn_code_verification_lk").attributes().disabled).toBeDefined();

    await wrapper.find("#agreement-check-box").setChecked(true);
    await wrapper.find("#agreement-check-box_rec").setChecked(true);

    expect(wrapper.findComponent("#btn_code_verification_lk").attributes().disabled).toBeDefined();

    wrapper.findComponent({ ref: "policyNumber" }).setValue("12345");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent("#btn_code_verification_lk").attributes().disabled).not.toBeDefined();

    wrapper.findComponent({ ref: "policyNumber" }).setValue("");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent("#btn_code_verification_lk").attributes().disabled).toBeDefined();

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);

    await checkboxComponent.setChecked(false);

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent("#btn_code_verification_lk").attributes().disabled).not.toBeDefined();

    expect(wrapper.findComponent("#btn_change_data_registration_lk").attributes().disabled).toBeDefined();

    expect(wrapper.find("#verify-success-message").exists()).toBe(false);

    await wrapper.find("#btn_code_verification_lk").trigger("click");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.find("#verify-success-message").exists()).toBe(true);

    expect(wrapper.findComponent("#btn_change_data_registration_lk").attributes().disabled).not.toBeDefined();

    expect(wrapper.findComponent("#btn_chek_registration_lk").attributes().disabled).toBeDefined();

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(true);

    await wrapper.find("#sms-confirm").setValue("12345");

    expect(wrapper.findComponent("#btn_chek_registration_lk").attributes().disabled).not.toBeDefined();

    expect(wrapper.findComponent("#btn_code_verification_lk").attributes().disabled).toBeDefined();

    jest.advanceTimersByTime(61000);

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent("#btn_change_data_registration_lk").attributes().disabled).not.toBeDefined();

    expect(wrapper.findComponent("#btn_code_verification_lk").attributes().disabled).not.toBeDefined();

    expect(wrapper.findComponent("#btn_change_data_registration_lk").attributes().disabled).not.toBeDefined();

    await wrapper.find("#btn_change_data_registration_lk").trigger("click");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.find("#verify-success-message").exists()).toBe(false);

    expect(wrapper.findComponent("#btn_change_data_registration_lk").attributes().disabled).toBeDefined();

    expect(wrapper.findComponent("#btn_chek_registration_lk").attributes().disabled).toBeDefined();

    expect(wrapper.findComponent("#btn_code_verification_lk").attributes().disabled).not.toBeDefined();
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
          MESSAGE: "Введите код подтверждения из СМС",
          MESSAGE_CODE: 200,
          GUID: "68A6B6024E3C03B39C9BFDC78D5E235B",
        },
      ],
    });

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);

    const surnameComponent = wrapper.findComponent({
      ref: "surnameComponent",
    });

    const surnameDropdown = surnameComponent.findComponent(ControlDropdownBase);

    await openDropdown(surnameDropdown);
    await typeSearch(surnameComponent, "П");
    await closeDropdown(surnameComponent);

    await wrapper.vm.$nextTick();

    expect(surnameDropdown.classes()).toContain("is-valid");

    const patronymicComponent = wrapper.findComponent({
      ref: "patronymicComponent",
    });

    const patronymicDropdown = patronymicComponent.findComponent(ControlDropdownBase);

    await openDropdown(patronymicDropdown);
    await typeSearch(patronymicComponent, "П");
    await closeDropdown(patronymicComponent);

    await wrapper.vm.$nextTick();

    expect(patronymicDropdown.classes()).toContain("is-valid");

    const nameComponent = wrapper.findComponent({
      ref: "nameComponent",
    });

    const nameDropdown = nameComponent.findComponent(ControlDropdownBase);

    await openDropdown(nameDropdown);
    await typeSearch(nameComponent, "П");
    await closeDropdown(nameComponent);

    await wrapper.vm.$nextTick();

    expect(nameDropdown.classes()).toContain("is-valid");

    const checkboxComponent = wrapper.findComponent("#policy-exist-check-box");

    expect(wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled).toBeDefined();

    await checkboxComponent.setChecked(true);

    expect(wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled).not.toBeDefined();

    wrapper.findComponent({ ref: "policyNumber" }).setValue("123");

    const dataPickerInput = wrapper.findComponent("#birthday-picker").find("input");

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

    await wrapper.find("#password1").setValue("Aa1234!5");
    expect(wrapper.find("#password1").classes()).toContain("is-valid");

    await wrapper.find("#password2").setValue("12345");
    expect(wrapper.find("#password2").classes()).toContain("is-invalid");

    await wrapper.find("#password2").setValue("Aa1234!5");
    expect(wrapper.find("#password2").classes()).toContain("is-valid");

    await wrapper.find("#agreement-check-box").setChecked(true);
    await wrapper.find("#agreement-check-box_rec").setChecked(true);

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
        PASSWORD: "Aa1234!5",
        PASSWORD_CONFIRM: "Aa1234!5",
        PHONE: "+7(910)-123-22-33",
        POLICY_NUMBER: "123",
        SECONDNAME: "П",
        THIRDNAME: "П",
        USER_CONFIRM: "Y",
        CONFIRM_MARKETING: "Y",
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
          STATUS: 520,
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
        PASSWORD: "Aa1234!5",
        PASSWORD_CONFIRM: "Aa1234!5",
        PHONE: "+7(910)-123-22-33",
        POLICY_NUMBER: "123",
        SECONDNAME: "П",
        THIRDNAME: "П",
        USER_CONFIRM: "Y",
        CONFIRM_MARKETING: "Y",
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

    expect(wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled).toBeDefined();

    const checkboxComponent = wrapper.findComponent("#policy-exist-check-box");

    await checkboxComponent.setChecked(true);

    expect(wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled).not.toBeDefined();

    wrapper.findComponent({ ref: "policyNumber" }).setValue("123");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent({ ref: "policyNumber" }).classes()).toContain("is-valid");

    wrapper.findComponent({ ref: "policyNumber" }).setValue("");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent({ ref: "policyNumber" }).classes()).toContain("is-invalid");

    await checkboxComponent.setChecked(false);

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent({ ref: "policyNumber" }).classes()).not.toContain("is-invalid");
  });

  // TODO: doesn't work in prod
  it.skip("Проверяем возможность введения пробела в поле Фамилии в качестве непервого символа", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, { localVue, attachTo: document.body });

    const surnameComponent = wrapper.findComponent({
      ref: "surnameComponent",
    });

    const surnameDropdown = surnameComponent.findComponent(ControlDropdownBase);

    await openDropdown(surnameDropdown);
    await typeSearch(surnameComponent, "Гаврило   в");
    await closeDropdown(surnameComponent);

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.family.length).toBe(11);
  });

  it("Проверяем возможность введения тире в поле Фамилия в качестве непервого символа", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, { localVue, attachTo: document.body });

    const surnameComponent = wrapper.findComponent({
      ref: "surnameComponent",
    });

    const surnameDropdown = surnameComponent.findComponent(ControlDropdownBase);

    await openDropdown(surnameDropdown);
    await typeSearch(surnameComponent, "На-На");
    await closeDropdown(surnameComponent);

    expect(surnameComponent.classes()).toContain("is-valid");
  });

  it("Проверяем возможность введения двух тире в середине в поле Фамилия в качестве непервого символа", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, { localVue, attachTo: document.body });

    const surnameComponent = wrapper.findComponent({
      ref: "surnameComponent",
    });

    const surnameDropdown = surnameComponent.findComponent(ControlDropdownBase);

    await openDropdown(surnameDropdown);
    await typeSearch(surnameComponent, "На--На");
    await closeDropdown(surnameComponent);

    expect(surnameComponent.classes()).toContain("is-invalid");
  });

  it("Проверяем возможность введения тире в поле Фамилия в качестве первого символа", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, { localVue, attachTo: document.body });

    const surnameComponent = wrapper.findComponent({
      ref: "surnameComponent",
    });

    const surnameDropdown = surnameComponent.findComponent(ControlDropdownBase);

    await openDropdown(surnameDropdown);
    await typeSearch(surnameComponent, "-На-На");
    await closeDropdown(surnameComponent);

    expect(surnameComponent.classes()).toContain("is-invalid");
  });

  it("Проверка на запрет введения иностранных букв", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, { localVue, attachTo: document.body });

    const surnameComponent = wrapper.findComponent({
      ref: "surnameComponent",
    });

    const surnameDropdown = surnameComponent.findComponent(ControlDropdownBase);

    await openDropdown(surnameDropdown);
    await typeSearch(surnameComponent, "Joролев");
    await closeDropdown(surnameComponent);

    expect(surnameComponent.classes()).toContain("is-invalid");
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
          MESSAGE: "Введите код подтверждения из СМС",
          MESSAGE_CODE: 200,
          GUID: "68A6B6024E3C03B39C9BFDC78D5E235B",
        },
      ],
    });

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);

    const surnameComponent = wrapper.findComponent({
      ref: "surnameComponent",
    });

    const surnameDropdown = surnameComponent.findComponent(ControlDropdownBase);

    await openDropdown(surnameDropdown);
    await typeSearch(surnameComponent, "П      ");
    await closeDropdown(surnameComponent);

    await wrapper.vm.$nextTick();

    expect(surnameDropdown.classes()).toContain("is-valid");

    const patronymicComponent = wrapper.findComponent({
      ref: "patronymicComponent",
    });

    const patronymicDropdown = patronymicComponent.findComponent(ControlDropdownBase);

    await openDropdown(patronymicDropdown);
    await typeSearch(patronymicComponent, "П    ");
    await closeDropdown(patronymicComponent);

    await wrapper.vm.$nextTick();

    expect(patronymicDropdown.classes()).toContain("is-valid");

    const nameComponent = wrapper.findComponent({
      ref: "nameComponent",
    });

    const nameDropdown = nameComponent.findComponent(ControlDropdownBase);

    await openDropdown(nameDropdown);
    await typeSearch(nameComponent, "П     ");
    await closeDropdown(nameComponent);

    await wrapper.vm.$nextTick();

    expect(nameDropdown.classes()).toContain("is-valid");

    const checkboxComponent = wrapper.findComponent("#policy-exist-check-box");

    expect(wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled).toBeDefined();

    await checkboxComponent.setChecked(true);

    expect(wrapper.findComponent({ ref: "policyNumber" }).attributes().disabled).not.toBeDefined();

    wrapper.findComponent({ ref: "policyNumber" }).setValue("123");

    const dataPickerInput = wrapper.findComponent("#birthday-picker").find("input");

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

    await wrapper.find("#password1").setValue("Aa1234!5");
    expect(wrapper.find("#password1").classes()).toContain("is-valid");

    await wrapper.find("#password2").setValue("12345");
    expect(wrapper.find("#password2").classes()).toContain("is-invalid");

    await wrapper.find("#password2").setValue("Aa1234!5");
    expect(wrapper.find("#password2").classes()).toContain("is-valid");

    await wrapper.find("#agreement-check-box").setChecked(true);
    await wrapper.find("#agreement-check-box_rec").setChecked(true);

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
        PASSWORD: "Aa1234!5",
        PASSWORD_CONFIRM: "Aa1234!5",
        PHONE: "+7(910)-123-22-33",
        POLICY_NUMBER: "123",
        SECONDNAME: "П",
        THIRDNAME: "П",
        USER_CONFIRM: "Y",
        CONFIRM_MARKETING: "Y",
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
          STATUS: 520,
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
        PASSWORD: "Aa1234!5",
        PASSWORD_CONFIRM: "Aa1234!5",
        PHONE: "+7(910)-123-22-33",
        POLICY_NUMBER: "123",
        SECONDNAME: "П",
        THIRDNAME: "П",
        USER_CONFIRM: "Y",
        CONFIRM_MARKETING: "Y",
        GUID: "68A6B6024E3C03B39C9BFDC78D5E235B",
      },
      { headers: { "X-Application": "VueJS", recaptcha: undefined } }
    );
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(spy).toHaveBeenCalled();
    expect(window.location.href).toEqual("/login");
  });

  it("должен предупреждать если номер существует при нажатии на кнопку 'Получить код'", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, {
      localVue,
      mocks: {
        $LogEvent: (v) => v,
      },
    });

    const surnameComponent = wrapper.findComponent({
      ref: "surnameComponent",
    });

    const surnameDropdown = surnameComponent.findComponent(ControlDropdownBase);

    await openDropdown(surnameDropdown);
    await typeSearch(surnameComponent, "Казимиров");
    await closeDropdown(surnameComponent);

    await wrapper.vm.$nextTick();

    expect(surnameDropdown.classes()).toContain("is-valid");

    const patronymicComponent = wrapper.findComponent({
      ref: "patronymicComponent",
    });

    const patronymicDropdown = patronymicComponent.findComponent(ControlDropdownBase);

    await openDropdown(patronymicDropdown);
    await typeSearch(patronymicComponent, "Александрович");
    await closeDropdown(patronymicComponent);

    await wrapper.vm.$nextTick();

    expect(patronymicDropdown.classes()).toContain("is-valid");

    const nameComponent = wrapper.findComponent({
      ref: "nameComponent",
    });

    const nameDropdown = nameComponent.findComponent(ControlDropdownBase);

    await openDropdown(nameDropdown);
    await typeSearch(nameComponent, "Андрей");
    await closeDropdown(nameComponent);

    await wrapper.vm.$nextTick();

    expect(nameDropdown.classes()).toContain("is-valid");

    const dataPickerInput = wrapper.findComponent("#birthday-picker").find("input");

    dataPickerInput.setValue("27.06.1989");
    dataPickerInput.trigger("change");

    await wrapper.find("#password1").setValue("Carter911");
    await wrapper.find("#password2").setValue("Carter911");
    await wrapper.find("#phone").setValue("+7(901)-000-10-00");
    await wrapper.find("#agreement-check-box").setChecked(true);
    await wrapper.find("#agreement-check-box_rec").setChecked(true);

    const verifyUser = wrapper.findComponent({ ref: "verifyUser" });
    const spyBvModal = jest.spyOn(verifyUser.vm.$bvModal, "msgBoxConfirm");

    axios.post.mockReturnValue({
      data: [{ MESSAGE_CODE: 201 }],
    });
    await wrapper.find("#btn_code_verification_lk").trigger("click");
    await wrapper.vm.$nextTick();

    expect(spyBvModal).toHaveBeenCalled();
  });

  it("Всплывающее окно при нажатии на на кнопку 'Зарегистрироваться' (номер уже зарегистрирован)", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, {
      localVue,
      attachTo: document.body,
      mocks: {
        $LogEvent: (v) => v,
      },
    });

    axios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: [
          {
            MESSAGE: "Введите код подтверждения из СМС",
            MESSAGE_CODE: 200,
            GUID: "68A6B6024E3C03B39C9BFDC78D5E235B",
          },
        ],
        status: 200,
      })
    );

    const surnameComponent = wrapper.findComponent({
      ref: "surnameComponent",
    });

    const surnameDropdown = surnameComponent.findComponent(ControlDropdownBase);

    await openDropdown(surnameDropdown);
    await typeSearch(surnameComponent, "Казимиров");
    await closeDropdown(surnameComponent);

    await wrapper.vm.$nextTick();

    expect(surnameDropdown.classes()).toContain("is-valid");

    const patronymicComponent = wrapper.findComponent({
      ref: "patronymicComponent",
    });

    const patronymicDropdown = patronymicComponent.findComponent(ControlDropdownBase);

    await openDropdown(patronymicDropdown);
    await typeSearch(patronymicComponent, "Александрович");
    await closeDropdown(patronymicComponent);

    await wrapper.vm.$nextTick();

    expect(patronymicDropdown.classes()).toContain("is-valid");

    const nameComponent = wrapper.findComponent({
      ref: "nameComponent",
    });

    const nameDropdown = nameComponent.findComponent(ControlDropdownBase);

    await openDropdown(nameDropdown);
    await typeSearch(nameComponent, "Андрей");
    await closeDropdown(nameComponent);

    await wrapper.vm.$nextTick();

    expect(nameDropdown.classes()).toContain("is-valid");

    const dataPickerInput = wrapper.findComponent("#birthday-picker").find("input");

    dataPickerInput.setValue("27.06.1989");
    dataPickerInput.trigger("change");

    await wrapper.find("#password1").setValue("Aa1234!5");
    expect(wrapper.find("#password1").classes()).toContain("is-valid");

    await wrapper.find("#password2").setValue("Aa1234!5");
    expect(wrapper.find("#password2").classes()).toContain("is-valid");

    await wrapper.find("#agreement-check-box").setChecked(true);
    await wrapper.find("#agreement-check-box_rec").setChecked(true);

    await wrapper.find("#phone").setValue("+7(985)-686-81-48");

    await wrapper.find("#btn_code_verification_lk").trigger("click");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    await wrapper.find("#sms-confirm").setValue("1111");

    const bvModal = jest.spyOn(wrapper.vm.$bvModal, "msgBoxConfirm");

    axios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: [
          {
            MESSAGE_CODE: 201,
          },
        ],
        status: 200,
      })
    );
    await wrapper.find("#btn_chek_registration_lk").trigger("click");

    expect(bvModal).toHaveBeenCalled();
  });

  it("Выводит ошибку (что-то пошло не так)", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, {
      localVue,
      attachTo: document.body,
      mocks: {
        $LogEvent: (v) => v,
      },
    });

    axios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: [
          {
            MESSAGE: "Введите код подтверждения из СМС",
            MESSAGE_CODE: 200,
            GUID: "68A6B6024E3C03B39C9BFDC78D5E235B",
          },
        ],
        status: 200,
      })
    );

    const surnameComponent = wrapper.findComponent({
      ref: "surnameComponent",
    });

    const surnameDropdown = surnameComponent.findComponent(ControlDropdownBase);

    await openDropdown(surnameDropdown);
    await typeSearch(surnameComponent, "Казимиров");
    await closeDropdown(surnameComponent);

    await wrapper.vm.$nextTick();

    expect(surnameDropdown.classes()).toContain("is-valid");

    const patronymicComponent = wrapper.findComponent({
      ref: "patronymicComponent",
    });

    const patronymicDropdown = patronymicComponent.findComponent(ControlDropdownBase);

    await openDropdown(patronymicDropdown);
    await typeSearch(patronymicComponent, "Александрович");
    await closeDropdown(patronymicComponent);

    await wrapper.vm.$nextTick();

    expect(patronymicDropdown.classes()).toContain("is-valid");

    const nameComponent = wrapper.findComponent({
      ref: "nameComponent",
    });

    const nameDropdown = nameComponent.findComponent(ControlDropdownBase);

    await openDropdown(nameDropdown);
    await typeSearch(nameComponent, "Андрей");
    await closeDropdown(nameComponent);

    await wrapper.vm.$nextTick();

    expect(nameDropdown.classes()).toContain("is-valid");

    const dataPickerInput = wrapper.findComponent("#birthday-picker").find("input");

    dataPickerInput.setValue("27.06.1989");
    dataPickerInput.trigger("change");

    await wrapper.find("#password1").setValue("Aa1234!5");
    await wrapper.find("#password2").setValue("Aa1234!5");

    await wrapper.find("#agreement-check-box").setChecked(true);
    await wrapper.find("#agreement-check-box_rec").setChecked(true);

    await wrapper.find("#phone").setValue("+7(985)-686-81-48");

    await wrapper.find("#btn_code_verification_lk").trigger("click");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    await wrapper.find("#sms-confirm").setValue("1111");

    axios.post.mockImplementationOnce(() => {
      const wrongAuthError = new Error("");
      wrongAuthError.response = {
        data: {
          MESSAGE:
            'ORA-04063: package body "I3.PKG_LK_UTILS" имеет ошибки\nORA-06508: PL/SQL: невозможно найти вызываемый блок программы: "I3.PKG_LK_UTILS"\nORA-06512: на  line 1\nORA-06512: на  "MOBILE.AMUTILSREST", line 944\nORA-06512: на  line 1\n',
          STATUS: 500,
          REASON: "Internal Server Error",
          INFO: "PL/SQL: невозможно найти вызываемый блок программы",
        },
      };
      throw wrongAuthError;
    });

    await wrapper.find("#btn_chek_registration_lk").trigger("click");
    expect(wrapper.find("#error-message").text()).toContain(
      "Приносим извинения, в Личном Кабинете что-то пошло не так."
    );
  });
});
