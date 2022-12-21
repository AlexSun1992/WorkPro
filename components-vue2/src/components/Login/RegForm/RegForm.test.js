import { createLocalVue, mount } from "@vue/test-utils";

import { BootstrapVue } from "bootstrap-vue";

import axios from "axios";

import RegForm from "./RegForm.vue";

jest.mock("axios");

describe("RegForm", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("должен показать поле код подверждения", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, { localVue });
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
  it("должен отображать поля после ввода кода подверждения", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, { localVue });
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

    await wrapper.find("#sms-confirm").setValue("12345");
    expect(wrapper.findComponent({ ref: "autocompleteSurname" }).exists()).toBe(
      true
    );
    expect(wrapper.findComponent({ ref: "autocompleteName" }).exists()).toBe(
      true
    );
    expect(
      wrapper.findComponent({ ref: "autocompletePatronymic" }).exists()
    ).toBe(true);
    expect(wrapper.findComponent("#check-box").exists()).toBe(true);
    expect(wrapper.findComponent("#birthday-picker").exists()).toBe(true);
    expect(wrapper.findComponent({ ref: "policyNumber" }).exists()).toBe(true);
    expect(wrapper.findComponent("#btn_chek_registration_lk").exists()).toBe(
      true
    );
  });
  it("должен корректно заполнять форму", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(RegForm, { localVue });
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

    await wrapper.find("#sms-confirm").setValue("12345");

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

    dataPickerInput.setValue("21.12.2022");

    dataPickerInput.trigger("change");

    await wrapper.findComponent({ ref: "policyNumber" }).trigger("focus");

    expect(dataPickerInput.classes()).toContain("is-valid");
  });
});
