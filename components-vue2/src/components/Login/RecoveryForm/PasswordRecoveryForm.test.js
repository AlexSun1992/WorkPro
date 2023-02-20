import { createLocalVue, mount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import axios from "axios";
import PasswordRecoveryForm from "./PasswordRecoveryForm.vue";

jest.mock("axios");
jest.useFakeTimers();

describe("PasswordRecoveryForm", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
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
    const wrapper = mount(PasswordRecoveryForm, {
      mocks: {
        localVue,
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

    await wrapper.find("#phone").setValue("+7(919)-777-00-02");
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
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(PasswordRecoveryForm, {
      mocks: {
        localVue,
        $LogEvent: (v) => v,
      },
    });

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
    const localVue = createLocalVue();
    const wrapper = mount(PasswordRecoveryForm, {
      localVue,
      mocks: {
        $LogEvent: (v) => v,
      },
    });

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
    const localVue = createLocalVue();
    const wrapper = mount(PasswordRecoveryForm, {
      localVue,
      mocks: {
        $LogEvent: (v) => v,
      },
    });

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
  it("Нажал кнопку измеить номер", async () => {
    const localVue = createLocalVue();
    const wrapper = mount(PasswordRecoveryForm, {
      localVue,
      mocks: {
        $LogEvent: (v) => v,
      },
    });

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

    await wrapper.find("#change_phone").trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.find("#sms-confirm").exists()).toBe(false);
  });

  it("Должен показать валидный пароль", async () => {
    let wrapper = null;
    const localVue = createLocalVue();
    wrapper = mount(PasswordRecoveryForm, {
      localVue,
      mocks: {
        $LogEvent: (v) => v,
      },
    });

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
    await wrapper.findComponent("#sms-confirm").setValue("11111");

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
    const localVue = createLocalVue();
    const wrapper = mount(PasswordRecoveryForm, {
      localVue,
      mocks: {
        $LogEvent: (v) => v,
      },
    });

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

  it("Должен показать, что форма заполнена верно", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(PasswordRecoveryForm, {
      localVue,
      attachTo: document.body,
      mocks: {
        $LogEvent: (v) => v,
      },
    });

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
        data: [{ MESSAGE: "Вы успешно зарегистрированы", MESSAGE_CODE: "200" }],
        status: 200,
      })
    );

    const dataPickerInput = wrapper.find("[data-testid=regBornDate]");
    dataPickerInput.setValue("21.12.2022");
    dataPickerInput.trigger("change");

    await wrapper.findComponent("#password1").trigger("focus");
    await wrapper.find("#password1").setValue("12345hH");
    await wrapper.find("#password2").setValue("12345hH");
    await wrapper.find("#btn_change-password_tel_lk").trigger("click");

    const spy = jest.spyOn(wrapper.vm.$bvModal, "msgBoxOk");
    spy.mockImplementation(() => Promise.resolve());

    Object.defineProperty(window, "location", {
      value: {
        href: "/",
      },
    });

    await wrapper.find("#btn_change-password_tel_lk").trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(window.location.href).toEqual("/login");
  });

  it("Должен отправить log с текстом 'Показало сообщение об ошибке на номере'", async () => {
    const localVue = createLocalVue();
    let logs = [];
    localVue.use(BootstrapVue);
    const wrapper = mount(PasswordRecoveryForm, {
      localVue,
      mocks: {
        $LogEvent: (v) => {
          logs.push(v.message);
          return v;
        },
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

    expect(logs).toEqual([
      "Открыли форму восстановления пароля по телефону",
      'Нажал на кнопку Получить код на номере"',
      'Показало сообщение об ошибке на номере"',
    ]);
  });
  it("Должен отправить log, что есть ошибка на EMAIL", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    let logs = [];
    const wrapper = mount(PasswordRecoveryForm, {
      localVue,
      mocks: {
        $LogEvent: (v) => {
          logs.push(v.message);
        },
      },
    });
    await wrapper.find("#tab_tel_lk").trigger("click");
    await wrapper.find("[data-testid=btn_email]").trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    await wrapper.find("#email").setValue("kjdsflslkjgdvdlkmk@mail.ru");
    await wrapper.find("#btn_code_verification_lk").trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    await wrapper.find("#sms-confirm").setValue("11111");

    axios.post.mockImplementationOnce(() => {
      const wrongAuthError = new Error("");
      wrongAuthError.response = {
        data: {
          STATUS: 500,
        },
      };
      throw wrongAuthError;
    });

    const dataPickerInput = wrapper.find("[data-testid=regBornDate]");
    dataPickerInput.setValue("21.12.2022");
    dataPickerInput.trigger("change");

    await wrapper.findComponent("#password1").trigger("focus");
    await wrapper.find("#password1").setValue("12345hH");
    await wrapper.find("#password2").setValue("12345hH");
    await wrapper.find("#btn_change-password_mail_lk").trigger("click");

    expect(logs).toEqual([
      "Открыли форму восстановления пароля по телефону",
      "Открыли форму восстановления пароля по EMAIL",
      'Нажал на кнопку Получить код на EMAIL"',
      'Нажал "Изменить пароль через EMAIL"',
      'Показало сообщение об ошибке на EMAIL"',
    ]);
  });

  it("Должен показать log с текстом 'Открыли форму восстановления пароля по телефону'", async () => {
    const localVue = createLocalVue();
    let logs = [];
    localVue.use(BootstrapVue);
    const wrapper = mount(PasswordRecoveryForm, {
      localVue,
      mocks: {
        $LogEvent: (v) => {
          logs.push(v.message);
          return v;
        },
      },
    });
    axios.post.mockReturnValue({
      data: [
        {
          MESSAGE_CODE: 200,
        },
      ],
    });

    await wrapper.find("#phone").setValue("+7(999)-999-99-88");
    await wrapper.find("#btn_code_verification_lk").trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(logs).toEqual([
      "Открыли форму восстановления пароля по телефону",
      'Нажал на кнопку Получить код на номере"',
    ]);
  });

  it("Не должен показывать  log с текстом об ошибке после капчи на телефоне", async () => {
    const localVue = createLocalVue();
    let logs = [];
    localVue.use(BootstrapVue);
    const wrapper = mount(PasswordRecoveryForm, {
      localVue,
      mocks: {
        $LogEvent: (v) => {
          logs.push(v.message);
          return v;
        },
      },
    });

    await axios.post.mockReturnValue({
      data: [
        {
          ERROR: "[Смотрите список ошибок.]",
          ERRORCODE: 106,
          ERRORLIST: [{ ERRORTEXT: "Решите капчу" }],
        },
      ],
    });

    await wrapper.find("#phone").setValue("+7(999)-999-33-35");
    await wrapper.find("#btn_code_verification_lk").trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    await wrapper.find("#phone").setValue("+7(999)-999-33-35");
    await wrapper.find("#btn_code_verification_lk").trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(logs).toEqual([
      "Открыли форму восстановления пароля по телефону",
      'Нажал на кнопку Получить код на номере"',
    ]);
  });

  it("log отправляет ошибку после нажатия на кнопку изменить пароль на телефоне", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    let logs = [];
    const wrapper = mount(PasswordRecoveryForm, {
      localVue,
      attachTo: document.body,
      mocks: {
        $LogEvent: (v) => {
          logs.push(v.message);
          return v;
        },
      },
    });

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
        status: 500,
      })
    );

    const dataPickerInput = wrapper.find("[data-testid=regBornDate]");
    dataPickerInput.setValue("21.12.2022");
    dataPickerInput.trigger("change");

    await wrapper.findComponent("#password1").trigger("focus");
    await wrapper.find("#password1").setValue("12345hH");
    await wrapper.find("#password2").setValue("12345hH");
    await wrapper.find("#btn_change-password_tel_lk").trigger("click");

    expect(logs).toEqual([
      "Открыли форму восстановления пароля по телефону",
      'Нажал на кнопку Получить код на номере"',
      'Нажал "Изменить пароль через номер"',
      'Показало сообщение об ошибке на номере"',
    ]);
  });
});
