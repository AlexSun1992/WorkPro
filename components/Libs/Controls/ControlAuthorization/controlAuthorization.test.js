import { mount } from "@vue/test-utils";
import ControlAuthorization from "~/components/Libs/Controls/ControlAuthorization/ControlAuthorization.vue";

describe("ControlAuthorization", () => {
  let wrapper;

  test("is phoneNumber valid", () => {
    wrapper = mount(ControlAuthorization, {});

    wrapper.vm.showModal();
    wrapper.vm.$nextTick(() => {
      wrapper.setData({ phoneNumber: "89031234567" });

      expect(wrapper.vm.isPhoneValid).toBeTruthy();
      expect(wrapper.contains("#phoneNumber").classList).toBe("is-valid");
    });
  });
});
