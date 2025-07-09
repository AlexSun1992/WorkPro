import { createLocalVue, mount, vue } from "@vue/test-utils";
import PluginLoaderOverlay from "./PluginLoadingOverlay";
import PluginModal from "../VuePluginModal/PluginModal";

describe("PluginLoaderOverlay", () => {
  let localValue;
  let wrapper;
  let vueComponentWrapper;

  beforeEach(() => {
    localValue = createLocalVue();
    localValue.use(PluginLoaderOverlay);
    vueComponentWrapper = {
      template: `
        <div class='cabinet'>
        </div>
      `,
      data() {
        return {};
      },
      methods: {},
    };
    const elem = document.createElement("div");
    if (document.body) {
      document.body.appendChild(elem);
    }
    wrapper = mount(vueComponentWrapper, {
      localValue,
      attachTo: elem,
    });
  });

  // TODO нужно реализовать
  it("Show LoaderOverlay", () => {
    expect(true).toBeTruthy();
  });
});
