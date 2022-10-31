import { mount } from "@vue/test-utils";

import LoginForm from "./LoginForm";

describe("LoginForm", () => {
  it("должен показать кнопку авторизоваться", () => {
    const wrapper = mount(LoginForm);
    expect(wrapper.text()).toContain("Авторизоваться");
  });
});
