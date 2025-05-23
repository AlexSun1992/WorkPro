import { mount } from "@vue/test-utils";
import ControlAuthorization from "./ControlAuthorization";
import controlAuthorizationTestData from "./controlAuthorizationTestData";

describe("ControlAuthorization", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    window.location = originalLocation;
  });

  test("is phoneNumber valid", () => {
    const wrapper = mount(ControlAuthorization, {
      mocks: {
        $store: { state: { data_card: { loading: false } } },
      },
    });
    wrapper.vm.showModal();
    wrapper.vm.$nextTick(() => {
      wrapper.setData({
        phoneNumber: controlAuthorizationTestData.validPhoneNumber,
      });

      expect(wrapper.vm.isPhoneValid).toBeTruthy();
      expect(wrapper.contains("#phoneNumber").classList).toBe("is-valid");
    });
  });

  test("is phoneNumber Invalid", () => {
    const wrapper = mount(ControlAuthorization, {
      mocks: {
        $store: { state: { data_card: { loading: false } } },
      },
    });
    wrapper.vm.showModal();
    wrapper.vm.$nextTick(() => {
      wrapper.setData({ phoneNumber: "" });

      expect(wrapper.vm.isPhoneValid).toBeFalsy();
      expect(wrapper.contains("#phoneNumber").classList).toBe("is-invalid");
    });
  });

  test("is form data reset", () => {
    const wrapper = mount(ControlAuthorization, {
      mocks: {
        $store: { state: { data_card: { loading: false } } },
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
    const wrapper = mount(ControlAuthorization, {
      mocks: {
        $store: { state: { data_card: { loading: false } } },
      },
    });
    wrapper.vm.showModal();
    wrapper.vm.$nextTick(() => {
      wrapper.setData({
        SMSCode: controlAuthorizationTestData.validSMSCode,
      });

      expect(wrapper.vm.isPhoneValid).toBeTruthy();
      expect(wrapper.contains("#smsCode").classList).toBe("is-valid");
    });
  });

  test("is smsCode valid", () => {
    const wrapper = mount(ControlAuthorization, {
      mocks: {
        $store: { state: { data_card: { loading: false } } },
      },
    });
    wrapper.vm.showModal();
    wrapper.vm.$nextTick(() => {
      wrapper.setData({
        SMSCode: "",
      });

      expect(wrapper.vm.isPhoneValid).toBeTruthy();
      expect(wrapper.contains("#smsCode").classList).toBe("is-invalid");
    });
  });
  test("корректно подставляется ошибка из query параметра error", async () => {
    delete window.location;
    window.location = { search: "?error=123" };
    const wrapper = mount(ControlAuthorization, {
      mocks: {
        $store: { state: { data_card: { loading: false } } },
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find("#errorMessage").exists()).toBe(true);
    expect(wrapper.find("#errorMessage").html()).toContain("123");
  });
  test("ошибка не отображается если в query параметре отсутствует error", async () => {
    const wrapper = mount(ControlAuthorization, {
      mocks: {
        $store: { state: { data_card: { loading: false } } },
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find("#errorMessage").exists()).toBe(false);
  });
});
