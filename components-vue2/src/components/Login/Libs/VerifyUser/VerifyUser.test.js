import VerifyUser from "./VerifyUser.vue";
import { mount } from "@vue/test-utils";
jest.mock("axios");

describe("VerifyUser", () => {
  let wrapper;

  const createComponent = () => {
    wrapper = mount(VerifyUser, {
      propsData: [
        "count",
        "v",
        "validateState",
        "disabled",
        "loginType",
        "modeType",
        "label",
        "context",
        "textMessage",
        "tabIndex",
        "error",
        "isError",
        "isCodeFieldValid",
        "logParams",
      ],

      mocks: {
        $store: { commit: () => null },
      },
    });
  };
  afterEach(() => {
    jest.resetAllMocks();
  });
  afterEach(() => {
    wrapper.destroy();
  });

  it("тестовый тест", () => {
    createComponent();
    const result = wrapper;
    expect(result).not.toBe(null);
  });
});
