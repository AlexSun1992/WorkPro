import { mount } from "@vue/test-utils";
import ProgressBar from "./ProgressBar.vue";
import progressBarMock from "./progressBar.mock";
// eslint-disable-next-line
import ControlDropdown from "../../../../components/Libs/Controls/ControlDropdown/ControlDropdown.vue";

const propsData = progressBarMock;
describe("Wizard ProgressBar", () => {
  let wrapper;

  test("Show progressBar with data", () => {
    wrapper = mount(ProgressBar, {
      propsData,
    });
    const htmlData = wrapper.html();

    expect(htmlData).toContain("Данные об авто");
    expect(htmlData).toContain("<h2>Личные данные</h2>");
    expect(htmlData).toContain(" - шаг ");
  });

  test("Change current step", async () => {
    const newId = propsData.wizardCursor[0].ID;
    wrapper = mount(ProgressBar, {
      propsData,
      stubs: { ControlDropdown },
    });

    expect(wrapper.emitted().update).toBeFalsy();

    wrapper.vm.goToTab(newId);

    expect(wrapper.emitted().update).toBeTruthy();
    expect(wrapper.emitted().update[0]).toEqual([newId]);
  });

  test("Progress bar position", () => {
    wrapper = mount(ProgressBar, {
      propsData,
    });
    const totalTabs = wrapper.vm.tabs.length;
    const currentOrder = wrapper.vm.currentTabOrder;
    const result = (100 / totalTabs) * (currentOrder - 1);

    expect(wrapper.html()).toContain(`width: ${Math.trunc(result)}`);
  });

  test("Progress bar with empty data", () => {
    wrapper = mount(ProgressBar, {
      propsData: {
        wizardRels: [],
        wizardCursor: [],
        wizardIDCARDS: [],
        wizardNavigation: {},
      },
    });
    const htmlData = wrapper.html();

    expect(htmlData).toContain("Текущий этап");
    expect(htmlData).toContain("Следующий этап");
    expect(htmlData).not.toContain(" - шаг ");
  });
});
