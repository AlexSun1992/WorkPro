import { createLocalVue, mount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import axios from "axios";
import PasswordRecoveryForm from "./PasswordRecoveryForm.vue";
import { not } from "ip";

jest.mock("axios");

describe("PasswordRecoveryForm", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Должен показать сообщение об отсутствии профиля с указанным номером телефона", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(PasswordRecoveryForm, { localVue });

    axios.post.mockReturnValue({
      data: [
        {
          MESSAGE_CODE: 203,
        },
      ],
    });

    await wrapper.find("#phone").setValue("+7(902)-000-10-00");
    await wrapper.find("#btn_code_verification_lk").trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain(
      "В Личном кабинете отсутствует профиль с данным номером телефона"
    );
  });

  it("Необходимо раздизабливать поле 'Получить код' при отсутствии номера телефона в базе", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(PasswordRecoveryForm, { localVue });
    axios.post.mockReturnValue({
      data: [
        {
          MESSAGE_CODE: 203,
        },
      ],
    });

    await wrapper.find("#phone").setValue("+7(902)-000-10-00");
    await wrapper.find("#btn_code_verification_lk").trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(
      wrapper.find("#btn_code_verification_lk").attributes()
    ).not.toContain("disabled");
  });

  it("Необходимо раздизабливать поле 'Получить код' при отсутствии email в базе", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(PasswordRecoveryForm, { localVue });

    //
    const buttonSelector = "[data-testid=btn_email]";
    await wrapper.find(buttonSelector).trigger("click");
    axios.post.mockReturnValue({
      data: [
        {
          MESSAGE_CODE: 203,
        },
      ],
    });

    await wrapper.find("#email").setValue("kjdsflslkjgdvdlkmk@mail.ru");
    await wrapper.find("#btn_code_verification_lk").trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(
      wrapper.find("#btn_code_verification_lk").attributes()
    ).not.toContain("disabled");
  });

  it("Должен показывать сообщение об ошибке при наличии русского символа", async () => {
    const wrapper = mount(PasswordRecoveryForm);
    await wrapper.find("#tab_mail_lk").trigger("click");
    await wrapper.find("#email").setValue("русскийсимвол@mail.ru");
    const emailInput = await wrapper.find("#email");
    expect(emailInput.classes()).toContain("is-invalid");
    expect(wrapper.text()).toContain("Русские символы запрещены");
  });

  it("Должен показывать сообщение об ошибке при наличии знака +", async () => {
    const wrapper = mount(PasswordRecoveryForm);
    await wrapper.find("#tab_mail_lk").trigger("click");
    const emailInput = await wrapper.find("#email");
    await wrapper.find("#email").setValue("Vasya+Katya@mail.ru");
    expect(emailInput.classes()).toContain("is-invalid");
    expect(wrapper.text()).toContain("Знак '+' запрещен");
  });

  it("Не должен показывать сообщение об ошибке при корректном email", async () => {
    const wrapper = mount(PasswordRecoveryForm);
    await wrapper.find("#tab_mail_lk").trigger("click");
    await wrapper.find("#email").setValue("test@mail.ru");
    const emailInput = await wrapper.find("#email");
    expect(emailInput.classes()).toContain("is-valid");
    expect(wrapper.text()).not.toContain("Некорректный символ");
  });

  it("Валидация правильности ввода телефона", async () => {
    const wrapper = mount(PasswordRecoveryForm);
    const verificationButton = await wrapper.find("#btn_code_verification_lk");
    expect(verificationButton.attributes("disabled")).toBe("disabled");
    await wrapper.find("#phone").setValue("+7(499)-000-00-02");
    expect(verificationButton.attributes("disabled")).toBe(undefined);
  });

  it("должен показывать ошибку", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(PasswordRecoveryForm, { localVue });

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
    const wrapper = mount(PasswordRecoveryForm);

    axios.post.mockReturnValue({
      data: [
        {
          MESSAGE_CODE: 200,
        },
      ],
    });

    expect(wrapper.find("#sms-confirm").exists()).toBe(false);

    await wrapper.find("#phone").setValue("+7(910)-123-22-33");
    await wrapper.find("#btn_code_verification_lk").trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(true);
  });

  // it("При клике на кнопку 'Изменить номер' поле 'Телефон' становится пустым и кнопка 'Получить код' становится disabled", async () => {
  //   const wrapper = mount(PasswordRecoveryForm);

  //   axios.post.mockReturnValue({
  //     data: [
  //       {
  //         MESSAGE_CODE: 200,
  //       },
  //     ],
  //   });
  //   await wrapper.find("#phone").setValue("+7(910)-123-22-33");
  //   await wrapper.find("#btn_code_verification_lk").trigger("click");
  //   await wrapper.vm.$nextTick();
  //   await wrapper.vm.$nextTick();

  //   await wrapper.find("#change_phone").trigger("click");
  //   await wrapper.vm.$nextTick();
  //   await wrapper.vm.$nextTick();

  //   expect(wrapper.find("#phone").text()).toContain("");

  //   expect(
  //     wrapper.find("#btn_code_verification_lk").attributes("disabled")
  //   ).toBe("disabled");
  // });

  it("Должен показать поля 'Дата рождения', 'Пароль','Повторите пароль' и кнопку 'Изменить пароль'", async () => {
    const wrapper = mount(PasswordRecoveryForm);

    axios.post.mockReturnValue({
      data: [
        {
          MESSAGE_CODE: 200,
        },
      ],
    });
    await wrapper.find("#phone").setValue("+7(910)-123-22-33");
    await wrapper.find("#btn_code_verification_lk").trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    await wrapper.find("#sms-confirm").setValue("11111");
    expect(wrapper.find("#birth-date").exists()).toBe(true);
  });

  // it("Должны совпадать пароли", async () => {
  //   const wrapper = mount(PasswordRecoveryForm);

  //   axios.post.mockReturnValue({
  //     data: [
  //       {
  //         MESSAGE_CODE: 200,
  //       },
  //     ],
  //   });
  //   await wrapper.find("#phone").setValue("+7(910)-123-22-33");
  //   await wrapper.find("#btn_code_verification_lk").trigger("click");
  //   await wrapper.vm.$nextTick();
  //   await wrapper.vm.$nextTick();

  //   await wrapper.find("#sms-confirm").setValue("11111");
  //   const password = await wrapper.find("#password1").setValue("111111");
  //   const password2 = await wrapper.find("#password2").setValue("111111");
  //   expect(password).toBe(password2);
  // });

  // it("Должны совпадать пароли", async () => {
  //   const wrapper = mount(PasswordRecoveryForm);

  //   axios.post.mockReturnValue({
  //     data: [
  //       {
  //         MESSAGE_CODE: 200,
  //       },
  //     ],
  //   });
  //   await wrapper.find("#phone").setValue("+7(910)-123-22-33");
  //   await wrapper.find("#btn_code_verification_lk").trigger("click");
  //   await wrapper.vm.$nextTick();
  //   await wrapper.vm.$nextTick();

  //   await wrapper.find("#sms-confirm").setValue("11111");
  //   const password = await wrapper.find("#password1").setValue("111111");
  //   const password2 = await wrapper.find("#password2").setValue("111111");
  //   expect(password).toBe(password2);
  // });

  // it.only("Должна появиться ошибка, что пароли не совпадают", async () => {
  //   const wrapper = mount(PasswordRecoveryForm);

  //   axios.post.mockReturnValue({
  //     data: [
  //       {
  //         MESSAGE_CODE: 200,
  //       },
  //     ],
  //   });
  //   await wrapper.find("#phone").setValue("+7(910)-123-22-33");
  //   await wrapper.find("#btn_code_verification_lk").trigger("click");
  //   await wrapper.vm.$nextTick();
  //   await wrapper.vm.$nextTick();

  //   await wrapper.find("#sms-confirm").setValue("11111");
  //   const password = await wrapper.find("#password1");
  //   console.log("password:", password);
  //   const result = password.setValue("14758585");
  //   console.log("result:", result);
  //   const password2 = await wrapper.find("#password2").setValue("1111110110");
  // expect(password).toMatch(password2);
  // console.log(password, password2);
  // });

  it("должен корректно заполнять форму", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(PasswordRecoveryForm, {
      localVue,
      attachTo: document.body,
    });
    axios.post.mockReturnValue({
      data: [
        {
          MESSAGE_CODE: 200,
        },
      ],
    });

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);
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

    //await wrapper.find("#sms-confirm").setValue("12345");

    // const surnameComponent = wrapper.findComponent({
    //   ref: "autocompleteSurname",
    // });
    // const surnameInput = surnameComponent.find("input");
    // await surnameInput.setValue("П");
    // expect(surnameComponent.classes()).toContain("is-valid");

    // const patronymicComponent = wrapper.findComponent({
    //   ref: "autocompletePatronymic",
    // });
    // const patronymicInput = patronymicComponent.find("input");
    // await patronymicInput.setValue("П");

    // const nameComponent = wrapper.findComponent({
    //   ref: "autocompleteName",
    // });
    // const nameInput = nameComponent.find("input");
    // await nameInput.setValue("П");

    // const checkboxComponent = wrapper.findComponent("#check-box");

    // await checkboxComponent.setChecked(true);

    // expect(patronymicInput.attributes().disabled).toBeDefined();

    // const dataPickerInput = wrapper
    //   .findComponent("#birthday-picker")
    //   .find("input");

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

    // await wrapper.find("#password1").setValue("12345");
    // expect(wrapper.find("#password1").classes()).toContain("is-invalid");

    // await wrapper.find("#password1").setValue("123456");
    // expect(wrapper.find("#password1").classes()).toContain("is-valid");

    // await wrapper.find("#password2").setValue("12345");
    // expect(wrapper.find("#password2").classes()).toContain("is-invalid");

    // await wrapper.find("#password2").setValue("123456");
    // expect(wrapper.find("#password2").classes()).toContain("is-valid");

    // axios.post.mockImplementationOnce(() => {
    //   const wrongAuthError = new Error("");
    //   wrongAuthError.response = {
    //     data: {
    //       MESSAGE:
    //         'ORA-20105: Неправильно введен код подтверждения или истек срок действия.\nORA-06512: на  "MOBILE.AMAUTH3", line 74\nORA-06512: на  "MOBILE.AMAUTH3", line 558\nORA-06512: на  line 1\n',
    //       STATUS: 500,
    //       REASON: "Internal Server Error",
    //       INFO: "Неправильно введен код подтверждения или истек срок действия.",
    //     },
    //   };
    //   throw wrongAuthError;
    // });

    // axios.post.mockImplementationOnce(() =>
    //   Promise.resolve({
    //     data: [{ MESSAGE: "Вы успешно зарегистрированы", MESSAGE_CODE: "200" }],
    //     status: 200,
    //   })
    // );

    // await wrapper.find("#btn_chek_registration_lk").trigger("click");
    // expect(wrapper.find("#error-message").exists()).toBe(true);
    // expect(wrapper.find("#error-message").text()).toContain(
    //   "Неправильно введен код подтверждения или истек срок действия."
    // );

    // const spy = jest.spyOn(wrapper.vm.$bvModal, "msgBoxOk");
    // spy.mockImplementation(() => Promise.resolve());

    // Object.defineProperty(window, "location", {
    //   value: {
    //     href: "/",
    //   },
    // });

    // await wrapper.find("#btn_chek_registration_lk").trigger("click");
    // expect(wrapper.find("#error-message").exists()).toBe(false);
    // expect(axios.post).toHaveBeenLastCalledWith(
    //   "/am/free/v2/registration",
    //   {
    //     BIRTHDATE: "2022-12-21",
    //     CODE: "12345",
    //     FIRSTNAME: "П",
    //     PASSWORD: "123456",
    //     PASSWORD_CONFIRM: "123456",
    //     PHONE: "+7(910)-123-22-33",
    //     POLICY_NUMBER: "",
    //     SECONDNAME: "П",
    //     THIRDNAME: "",
    //     THIRDNAMENOTEXISTS: "Y",
    //     USER_CONFIRM: "Y",
    //   },
    //   { headers: { "X-Application": "VueJS", recaptcha: undefined } }
    // );
    // await wrapper.vm.$nextTick();
    // await wrapper.vm.$nextTick();
    // expect(spy).toHaveBeenCalled();
    // expect(window.location.href).toEqual("/login");
  });
});
