import { mount } from "@vue/test-utils";
import SearchInput from "./SearchInput.vue";

describe("SearchInput", () => {
  let wrapper;

  const createWrapper = (props = {}, options = {}) => mount(SearchInput, {
      propsData: {
        value: "",
        placeholder: "",
        ...props,
      },
      ...options,
    });

  afterEach(() => {
    wrapper.destroy();
  });

  describe("Initial state", () => {
    it("renders correctly with default props", () => {
      wrapper = createWrapper();
      expect(wrapper.exists()).toBe(true);
    });
    it("has a placeholder", () => {
      wrapper = createWrapper({ placeholder: "Поиск" });
      const input = wrapper.find("input");
      expect(input.attributes("placeholder")).toBe("Поиск");
    });
    it("can be changed", () => {
      wrapper = createWrapper();
      const input = wrapper.find("input");
      input.setValue("test");
      expect(input.element.value).toBe("test");
      expect(wrapper.emitted().input).toBeTruthy();
      expect(wrapper.emitted().input[0]).toEqual(["test"]);
    });
    it("has a clickable clear button", async () => {
      wrapper = createWrapper({ value: "test" });
      const clearButton = wrapper.find("button");
      expect(clearButton.exists()).toBeTruthy();

      await clearButton.trigger("click");
      expect(wrapper.find("input").element.value).toBe("");
      expect(wrapper.emitted().clear).toBeTruthy();
    });
  });
});
