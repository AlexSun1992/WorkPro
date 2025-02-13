import { mount } from "@vue/test-utils";
import ControlAuthorization from "~/components/Libs/Controls/ControlAuthorization/ControlAuthorization.vue";
import controlAuthorizationTestData from "~/components/Libs/Controls/ControlAuthorization/controlAuthorizationTestData";

describe("ControlAuthorization", () => {
  let wrapper;

  test("is phoneNumber valid", () => {
    wrapper = mount(ControlAuthorization, {});

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
    wrapper = mount(ControlAuthorization, {});

    wrapper.vm.showModal();
    wrapper.vm.$nextTick(() => {
      wrapper.setData({ phoneNumber: "" });

      expect(wrapper.vm.isPhoneValid).toBeFalsy();
      expect(wrapper.contains("#phoneNumber").classList).toBe("is-invalid");
    });
  });

  test("is form data reset", () => {
    wrapper = mount(ControlAuthorization, {});

    wrapper.vm.showModal();
    wrapper.setData({
      phoneNumber: controlAuthorizationTestData.validPhoneNumber,
    });

    wrapper.vm.resetForm();

    expect(wrapper.vm.phoneNumber).toBe("");
  });
});
