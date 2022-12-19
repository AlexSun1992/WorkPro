import { createLocalVue, mount } from "@vue/test-utils";

import axios from "axios";

import RegForm from "./RegForm.vue";

jest.mock("axios");

describe("RegForm", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("должен показать поле код подверждения", async () => {
    const wrapper = mount(RegForm);
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
