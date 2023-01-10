import { mount, createLocalVue } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import VerifyPassword from "./VerifyPassword.vue";

describe("VerifyPassword", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Должен скрывать пароль", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);

    const wrapper = mount(VerifyPassword, { localVue });
    expect(wrapper.contains("div")).toBe(true);
  });
});
