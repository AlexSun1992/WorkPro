import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import ProgressBar from "./ProgressBar.vue";
import progressBarMock from "./progressBar.mock";

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
});
