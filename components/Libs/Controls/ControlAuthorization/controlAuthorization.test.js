import { mount } from "@vue/test-utils";
import ControlAuthorization from "./ControlAuthorization";
import controlAuthorizationTestData from "./controlAuthorizationTestData";

describe("ControlAuthorization", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    window.location = originalLocation;
  });

  const createStore = () => ({
    state: {
      data_card: {
        loading: false,
      },
    },
    commit: jest.fn(),
    getters: {
      "data_card/getSavedError": false,
      "data_card/getErrorMessage": null,
    },
  });

  test("is phoneNumber valid", () => {
    const store = createStore();
    const wrapper = mount(ControlAuthorization, {
      mocks: {
        $store: store,
      },
    });
    wrapper.vm.showModal();
    wrapper.vm.$nextTick(() => {
      wrapper.setData({
        phoneNumber: controlAuthorizationTestData.validPhoneNumber,
      });

      expect(wrapper.vm.isPhoneValid).toBeTruthy();
      expect(wrapper.find("#phoneNumber").classes()).toContain("is-valid");
    });
  });

  test("is phoneNumber Invalid", () => {
    const store = createStore();
    const wrapper = mount(ControlAuthorization, {
      mocks: {
        $store: store,
      },
    });
    wrapper.vm.showModal();
    wrapper.vm.$nextTick(() => {
      wrapper.setData({ phoneNumber: "" });

      expect(wrapper.vm.isPhoneValid).toBeFalsy();
      expect(wrapper.find("#phoneNumber").classes()).toContain("is-invalid");
    });
  });

  test("is form data reset", () => {
    const store = createStore();
    const wrapper = mount(ControlAuthorization, {
      mocks: {
        $store: store,
      },
    });
    wrapper.vm.showModal();
    wrapper.setData({
      phoneNumber: controlAuthorizationTestData.validPhoneNumber,
    });

    wrapper.vm.resetForm();

    expect(wrapper.vm.phoneNumber).toBe("");
  });

  test("is smsCode valid", () => {
    const store = createStore();
    const wrapper = mount(ControlAuthorization, {
      mocks: {
        $store: store,
      },
    });
    wrapper.vm.showModal();
    wrapper.vm.$nextTick(() => {
      wrapper.setData({
        SMSCode: controlAuthorizationTestData.validSMSCode,
      });

      expect(wrapper.vm.isSmsCodeValid).toBeTruthy();
      expect(wrapper.find("#smsCode").classes()).toContain("is-valid");
    });
  });

  test("is smsCode invalid", () => {
    const store = createStore();
    const wrapper = mount(ControlAuthorization, {
      mocks: {
        $store: store,
      },
    });
    wrapper.vm.showModal();
    wrapper.vm.$nextTick(() => {
      wrapper.setData({
        SMSCode: "",
      });
      wrapper.vm.touchSMSCode();

      expect(wrapper.vm.isSmsCodeValid).toBeFalsy();
      expect(wrapper.find("#smsCode").classes()).toContain("is-invalid");
    });
  });

  test("корректно подставляется ошибка из query параметра error", async () => {
    delete window.location;
    window.location = { search: "?error=123" };
    const store = createStore();
    const wrapper = mount(ControlAuthorization, {
      mocks: {
        $store: store,
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find("#errorMessage").exists()).toBe(true);
    expect(wrapper.find("#errorMessage").text()).toContain("123");
  });

  test("ошибка не отображается если в query параметре отсутствует error", async () => {
    const store = createStore();
    const wrapper = mount(ControlAuthorization, {
      mocks: {
        $store: store,
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find("#errorMessage").exists()).toBe(false);
  });
});
