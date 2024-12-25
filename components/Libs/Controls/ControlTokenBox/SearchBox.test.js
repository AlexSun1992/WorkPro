import { mount } from "@vue/test-utils";
import SearchBox from "./SearchBox.vue";

describe("SearchBox", () => {
  it('Set init input value', () => {
    const value = "Serach";
    const wrapper = mount(SearchBox, {
      propsData: {
        value
      }
    })

    expect(wrapper.vm.$refs.searchInput.value).toBe(value);
  });
});
