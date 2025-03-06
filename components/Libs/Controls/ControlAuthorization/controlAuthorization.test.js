import { mount } from "@vue/test-utils";
import ControlAuthorization from "./ControlAuthorization.vue";
import controlAuthorizationTestData from "./controlAuthorizationTestData";

describe("ControlAuthorization", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ControlAuthorization, {
      mocks: {
        $store: { state: { data_card: { loading: false } } },
      },
    });
  })

  test("is phoneNumber valid", () => {
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
    wrapper.vm.showModal();
    wrapper.vm.$nextTick(() => {
      wrapper.setData({ phoneNumber: "" });

      expect(wrapper.vm.isPhoneValid).toBeFalsy();
      expect(wrapper.contains("#phoneNumber").classList).toBe("is-invalid");
    });
  });

  test("is form data reset", () => {
    wrapper.vm.showModal();
    wrapper.setData({
      phoneNumber: controlAuthorizationTestData.validPhoneNumber,
    });

    wrapper.vm.resetForm();

    expect(wrapper.vm.phoneNumber).toBe("");
  });

  test("is smsCode valid", () => {
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
    wrapper.vm.showModal();
    wrapper.vm.$nextTick(() => {
      wrapper.setData({
        SMSCode: "",
      });

      expect(wrapper.vm.isPhoneValid).toBeTruthy();
      expect(wrapper.contains("#smsCode").classList).toBe("is-invalid");
    });
  });
});
