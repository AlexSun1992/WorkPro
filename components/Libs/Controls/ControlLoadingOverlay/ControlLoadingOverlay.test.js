import { mount } from "@vue/test-utils";
import ControlLoadingOverlay from "./ControlLoadingOverlay.vue";

describe("ControlLoadingOverlay", () => {
  test("Overlay must be visible", () => {
    const visible = true;
    const wrapper = mount(ControlLoadingOverlay, {
      propsData: {
        visible,
      },
    });

    expect(wrapper.vm.visibleComputed).toBe(visible);
  });

  test("Overlay can switch", async () => {
    let visible = true;
    const wrapper = mount(ControlLoadingOverlay, {
      propsData: {
        visible,
      },
    });

    visible = false;

    await wrapper.setProps({ visible });
    expect(wrapper.vm.visibleComputed).toBe(visible);

    visible = true;

    await wrapper.setProps({ visible });
    expect(wrapper.vm.visibleComputed).toBe(visible);
  });
});
