import { createLocalVue, mount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import axios from "axios";
import { not } from "ip";
import PasswordRecoveryForm from "./PasswordRecoveryForm.vue";


jest.mock("axios");

describe("PasswordRecoveryForm", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Должен показать сообщение об отсутствии профиля с указанным номером телефона", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(PasswordRecoveryForm, {
      localVue,
      mocks: {
        $LogEvent: (v) => v,
      },
    });

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
    const wrapper = mount(PasswordRecoveryForm, {
      localVue,
      mocks: {
        $LogEvent: (v) => v,
      },
    });
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
    const wrapper = mount(PasswordRecoveryForm, {
      localVue,
      mocks: {
        $LogEvent: (v) => v,
      },
    });

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
    const wrapper = mount(PasswordRecoveryForm, {
      mocks: {
        $LogEvent: (v) => v,
      },
    });
    await wrapper.find("#tab_mail_lk").trigger("click");
    await wrapper.find("#email").setValue("русскийсимвол@mail.ru");
    const emailInput = await wrapper.find("#email");
    expect(emailInput.classes()).toContain("is-invalid");
    expect(wrapper.text()).toContain("Русские символы запрещены");
  });

  it("Должен показывать сообщение об ошибке при наличии знака +", async () => {
    const wrapper = mount(PasswordRecoveryForm, {
      mocks: {
        $LogEvent: (v) => v,
      },
    });
    await wrapper.find("#tab_mail_lk").trigger("click");
    const emailInput = await wrapper.find("#email");
    await wrapper.find("#email").setValue("Vasya+Katya@mail.ru");
    expect(emailInput.classes()).toContain("is-invalid");
    expect(wrapper.text()).toContain("Знак '+' запрещен");
  });

  it("Не должен показывать сообщение об ошибке при корректном email", async () => {
    const wrapper = mount(PasswordRecoveryForm, {
      mocks: {
        $LogEvent: (v) => v,
      },
    });
    await wrapper.find("#tab_mail_lk").trigger("click");
    await wrapper.find("#email").setValue("test@mail.ru");
    const emailInput = await wrapper.find("#email");
    expect(emailInput.classes()).toContain("is-valid");
    expect(wrapper.text()).not.toContain("Некорректный символ");
  });

  it("Валидация правильности ввода телефона", async () => {
    const wrapper = mount(PasswordRecoveryForm, {
      mocks: {
        $LogEvent: (v) => v,
      },
    });
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

  it("Должен показать поле код подверждения", async () => {
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

  it("Должен показать валидное поле 'Дата рождения'", async () => {
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
    // console.log(wrapper.html());

    const dataPickerInput = wrapper.find("[data-testid=regBornDate]");
    dataPickerInput.setValue("21.12.2052");
    dataPickerInput.trigger("change");
    await wrapper.findComponent("#password1").trigger("focus");
    expect(dataPickerInput.classes()).not.toContain("is-valid");

    dataPickerInput.setValue("21.12.1852");
    dataPickerInput.trigger("change");
    await wrapper.findComponent("#password1").trigger("focus");
    expect(dataPickerInput.classes()).not.toContain("is-valid");

    dataPickerInput.setValue("21.12.2022");
    dataPickerInput.trigger("change");
    await wrapper.findComponent("#password1").trigger("focus");
    expect(dataPickerInput.classes()).toContain("is-valid");
  });

  it("Должен показать валидный пароль", async () => {
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

    const dataPickerInput = wrapper.find("[data-testid=regBornDate]");
    dataPickerInput.setValue("21.12.2022");
    dataPickerInput.trigger("change");
    await wrapper.findComponent("#password1").trigger("focus");

    await wrapper.find("#password1").setValue("12345");
    expect(wrapper.find("#password1").classes()).toContain("is-invalid");

    await wrapper.find("#password1").setValue("12345hH");
    expect(wrapper.find("#password1").classes()).not.toContain("is-invalid");
  });

  it("Должен показать, что пароли одинаковые", async () => {
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

    const dataPickerInput = wrapper.find("[data-testid=regBornDate]");
    dataPickerInput.setValue("21.12.2022");
    dataPickerInput.trigger("change");
    await wrapper.findComponent("#password1").trigger("focus");

    await wrapper.find("#password1").setValue("12345hH");

    await wrapper.find("#password2").setValue("12345hH");
    expect(wrapper.find("#password2").classes()).not.toContain("is-invalid");

    await wrapper.find("#password2").setValue("12345hP");
    expect(wrapper.find("#password2").classes()).toContain("is-invalid");
  });

  it.only("Должен показать, что форма заполнена верно", async () => {
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

    expect(axios.post).toHaveBeenCalledWith(
      "/am/free/v2/sendsmscode?smstype=recovery",
      {
        PHONE: "+7(910)-123-22-33",
        error: false,
        loginType: "phone",
        modeType: "RECOVERY",
        token: 1,
      },
      { headers: { "X-Application": "VueJS", recaptcha: 1 } }
    );

    await wrapper.find("#sms-confirm").setValue("11111");

    const dataPickerInput = wrapper.find("[data-testid=regBornDate]");
    dataPickerInput.setValue("21.12.2022");
    dataPickerInput.trigger("change");
    await wrapper.findComponent("#password1").trigger("focus");

    await wrapper.find("#password1").setValue("12345hH");
    await wrapper.find("#password2").setValue("12345hH");

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
        data: [{ MESSAGE: "Success", MESSAGE_CODE: "200" }],
        status: 200,
      })
    );

    await wrapper.find("#btn_change-password_tel_lk").trigger("click");
    // expect(wrapper.find("[data-testid=errorMessage]").exists()).toBe(true);
    // expect(wrapper.find("[data-testid=errorMessage]").text()).toContain(
    //   "Неправильно введен код подтверждения или истек срок действия."
    // );
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    console.log(wrapper.find("[data-testid=errorMessage]").text());
  });

  // it("Должен корректно заполнять форму", async () => {
  //   const localVue = createLocalVue();
  //   localVue.use(BootstrapVue);
  //   const wrapper = mount(PasswordRecoveryForm, {
  //     localVue,
  //     attachTo: document.body,
  //   });
  //   axios.post.mockReturnValue({
  //     data: [
  //       {
  //         MESSAGE_CODE: 200,
  //       },
  //     ],
  //   });

  //   expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);
  //   await wrapper.findComponent("#phone").setValue("+7(919)-778-36-86");
  //   expect(wrapper.find("#phone").classes()).toContain("is-valid");
  //   await wrapper.find("#btn_code_verification_lk").trigger("click");
  //   await wrapper.vm.$nextTick();
  //   await wrapper.vm.$nextTick();
  //   expect(axios.post).toHaveBeenCalledWith(
  //     "/am/free/v2/sendsmscode?smstype=recovery",
  //     {
  //       PHONE: "+7(919)-778-36-86",
  //       error: false,
  //       loginType: "phone",
  //       modeType: "RECOVERY",
  //       token: 1,
  //     },
  //     { headers: { "X-Application": "VueJS", recaptcha: 1 } }
  //   );
  //   expect(wrapper.find(".invalid-feedback").text()).toContain(
  //     "Пожалуйста, заполните это поле"
  //   );
  //   expect(wrapper.find(".invalid-feedback").isVisible()).toBe(true);
  //   await wrapper.find("#sms-confirm").setValue("12345");

  //   const dataPickerInput = wrapper.find('[data-testid="regBornDate"]');

  //   dataPickerInput.setValue("08.05.1999");
  //   dataPickerInput.trigger("change");
  //   expect(dataPickerInput.classes()).not.toContain("is-valid");

  //   dataPickerInput.setValue("21.12.1852");
  //   dataPickerInput.trigger("change");
  //   expect(dataPickerInput.classes()).not.toContain("is-valid");

  //   dataPickerInput.setValue("21.12.2022");
  //   dataPickerInput.trigger("change");
  //   expect(dataPickerInput.classes()).not.toContain("is-valid");

  //   await wrapper.find("#password1").setValue("12345");
  //   expect(wrapper.find("#password1").classes()).toContain(
  //     "form-control",
  //     "is-invalid"
  //   );
  //   await wrapper.find("#password2").setValue("12345");
  //   expect(wrapper.find("#password2").classes()).toContain(
  //     "form-control",
  //     "is-invalid"
  //   );

  //   await wrapper.find("#password1").setValue("123456rR");
  //   expect(wrapper.find("#password1").classes()).toContain(
  //     "form-control",
  //     "is-valid"
  //   );

  //   await wrapper.find("#password2").setValue("123456rR");
  //   expect(wrapper.find("#password2").classes()).toContain(
  //     "form-control",
  //     "is-valid"
  //   );

  //   axios.post.mockImplementationOnce(() => {
  //     const wrongAuthError = new Error("");
  //     wrongAuthError.response = {
  //       data: {
  //         INFO: "Пароль должен содержать, как минимум, одну цифру и одну букву. Пароль не должен содержать русских букв и специальных символов.",
  //         MESSAGE:
  //           'ORA-20105: Пароль должен содержать, как минимум, одну цифру и одну букву. Пароль не должен содержать русских букв и специальных символов.\nORA-06512: на  "MOBILE.AMAUTH3", line 761\nORA-06512: на  line 1\n',
  //         REASON: "Internal Server Error",
  //         STATUS: 500,
  //       },
  //     };
  //     throw wrongAuthError;
  //   });

  //   axios.post.mockImplementationOnce(() =>
  //     Promise.resolve({
  //       data: [{ MESSAGE: "Success", MESSAGE_CODE: "200" }],
  //       status: 200,
  //     })
  //   );

  //   await wrapper.find("#btn_change-password_tel_lk").trigger("click");
  //   await wrapper.vm.$nextTick();
  //   await wrapper.vm.$nextTick();
  //   console.log(wrapper.text());

  // expect(
  //   wrapper
  //     .text("Неправильно введен код подтверждения или истек срок действия.")
  //     .exists()
  // ).toBe(true);

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
  //   "/am/free/v2/restorepassword",
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
  // });
});
