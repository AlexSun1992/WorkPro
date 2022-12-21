import { mount } from "@vue/test-utils";
import PasswordRecoveryForm from "./PasswordRecoveryForm.vue";

describe("PasswordRecoveryForm", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("Должен показывать сообщение об ошибке при наличии русского символа", async() => {
        const wrapper = mount(PasswordRecoveryForm);
        await wrapper.find("#tab_mail_lk").trigger("click");
        await wrapper.find("#email").setValue("русскийсимвол@mail.ru");
        const emailInput = await wrapper.find("#email");
        expect(emailInput.classes()).toContain("is-invalid");
        expect(wrapper.text()).toContain("Русские символы запрещены");
    });

    it("Должен показывать сообщение об ошибке при наличии знака +", async() => {
        const wrapper = mount(PasswordRecoveryForm);
        await wrapper.find("#tab_mail_lk").trigger("click");
        const emailInput = await wrapper.find("#email");
        await wrapper.find("#email").setValue("Vasya+Katya@mail.ru");
        expect(emailInput.classes()).toContain("is-invalid");
        expect(wrapper.text()).toContain("Знак '+' запрещен");
    });

    it("Не должен показывать сообщение об ошибке при корректном email", async() => {
        const wrapper = mount(PasswordRecoveryForm);
        await wrapper.find("#tab_mail_lk").trigger("click");
        await wrapper.find("#email").setValue("test@mail.ru");
        const emailInput = await wrapper.find("#email");
        expect(emailInput.classes()).toContain("is-valid");
        expect(wrapper.text()).not.toContain("Некорректный символ");
    });

    it("Валидация правильности ввода телефона", async() => {
        const wrapper = mount(PasswordRecoveryForm);
        const verificationButton = await wrapper.find("#btn_code_verification_lk");
        expect(verificationButton.attributes("disabled")).toBe("disabled");
        await wrapper.find("#phone").setValue("+7(499)-000-00-02");
        expect(verificationButton.attributes("disabled")).toBe(undefined);
    });
});