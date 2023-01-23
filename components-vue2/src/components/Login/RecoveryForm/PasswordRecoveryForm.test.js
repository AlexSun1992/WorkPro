import { createLocalVue, mount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import axios from "axios";
import { not } from "ip";
import PasswordRecoveryForm from "./PasswordRecoveryForm.vue";
// import VeryfyUser from "../Libs/VerifyUser/VerifyUser.vue";

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

  it("должен показать поле код подверждения", async () => {
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
          MESSAGE:
            "На Ваш номер телефона был отправлен код, который необходимо ввести ниже.",
          MESSAGE_CODE: 200,
        },
      ],
    });

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(false);

    await wrapper.find("#phone").setValue("+7(910)-123-22-33");
    await wrapper.find("#btn_code_verification_lk").trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent("#sms-confirm").exists()).toBe(true);
  });
});
