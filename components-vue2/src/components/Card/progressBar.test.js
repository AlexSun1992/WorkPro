import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import ProgressBar from "./ProgressBar.vue";
import progressBarMock from "./progressBar.mock";
// eslint-disable-next-line
import ControlDropdown from "../../../../components/Libs/Controls/ControlDropdown/ControlDropdown.vue";

const propsData = progressBarMock;
describe("Wizard ProgressBar", () => {
  let wrapper;
  const localVue = createLocalVue();

  localVue.use(Vuex);

  test("Show progressBar with data", () => {
    wrapper = mount(ProgressBar, {
      propsData,
    });
    const htmlData = wrapper.html();

    expect(htmlData).toContain("Данные об авто");
    expect(htmlData).toContain("<h2>Личные данные</h2>");
  });

  test("Change current step", async () => {
    const newId = propsData.wizardCursor[0].ID;
    wrapper = mount(ProgressBar, {
      propsData,
      stubs: {ControlDropdown}
    });

    expect(wrapper.emitted().update).toBeFalsy();

    wrapper.vm.goToTab(newId);

    expect(wrapper.emitted().update).toBeTruthy();
    expect(wrapper.emitted().update[0][0]).toEqual(newId);
  });
});
